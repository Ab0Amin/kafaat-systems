import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { DataSource } from 'typeorm';
import {
  createTenantDataSource,
  getDataSourceOptions,
} from '@kafaat-systems/database';
import { AdminEntity, TenantEntity } from '@kafaat-systems/entities';
import * as bcrypt from 'bcrypt';

interface TableRow {
  tablename: string;
}

const copyFromTemplate = 'public';

@Injectable()
export class TenantService {
  constructor(private dataSource: DataSource) {}

  async getTenantByDomain(domain: string): Promise<TenantEntity | null> {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();

    try {
      const tenant = await ownerDS.getRepository(TenantEntity).findOne({
        where: { domain, isActive: true },
      });
      return tenant;
    } finally {
      await ownerDS.destroy();
    }
  }

  async registerTenant(dto: CreateTenantDto) {
    const schemaName = this.slugify(dto.name);

    // Check if schema already exists
    const existing = await this.dataSource.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
      [schemaName]
    );

    if (existing.length > 0) {
      throw new BadRequestException(`Schema "${schemaName}" already exists.`);
    }

    // Create schema
    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    // Initialize tenant data source
    const tenantDS = createTenantDataSource(schemaName);
    await tenantDS.initialize();

    try {
      // Run migrations for the new schema
      Logger.log(`Running migrations for schema: `);
      try {
        // Instead of running migrations, copy tables from public schema
        // This is more reliable than running migrations on each tenant schema
        const tables = await this.getTablesFromTemplate();

        for (const table of tables) {
          // Check if table exists in the new schema
          const tableExists = await this.dataSource.query(
            `
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = $1 
              AND table_name = $2
            )
          `,
            [schemaName, table]
          );

          if (!tableExists[0].exists) {
            // Create the table in the new schema
            await this.dataSource.query(`
              CREATE TABLE IF NOT EXISTS "${schemaName}"."${table}" 
              (LIKE public."${table}" INCLUDING ALL)
            `);
          }
        }

        Logger.log(`Schema  initialized successfully`);
      } catch (error) {
        Logger.error(`Error initializing schema : ${error.message}`);
        throw error;
      }

      // Create admin user for the tenant
      const passwordHash = await bcrypt.hash(dto.admin.password, 10);

      await tenantDS.getRepository(AdminEntity).save({
        firstName: dto.admin.fullName.split(' ')[0],
        lastName: dto.admin.fullName.split(' ').slice(1).join(' '),
        email: dto.admin.email,
        passwordHash,
        isActive: true,
      });

      // Save tenant info in owner schema
      const ownerDS = new DataSource(getDataSourceOptions('owner'));
      await ownerDS.initialize();

      try {
        await ownerDS.getRepository(TenantEntity).save({
          name: dto.name,
          domain: dto.domain,
          schema_name: schemaName,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } finally {
        await ownerDS.destroy();
      }

      return {
        success: true,
        message: `Tenant ${dto.name} successfully registered with schema ${schemaName}.`,
        tenant: {
          name: dto.name,
          domain: dto.domain,
          schema: schemaName,
        },
      };
    } catch (error: unknown) {
      // Rollback on error
      await this.dataSource.query(
        `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`
      );
      throw new BadRequestException(
        `Failed to register tenant: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    } finally {
      await tenantDS.destroy();
    }
  }

  private slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, '_');
  }

  async getTablesFromTemplate(): Promise<string[]> {
    try {
      const result = await this.dataSource.query(
        `
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = $1
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'sql_%'
        AND tablename NOT LIKE 'migrations'
        AND tablename NOT LIKE '\\_%' ESCAPE '\\'
      `,
        [copyFromTemplate]
      );

      if (!result || result.length === 0) {
        Logger.warn(`No tables found in template schema: `);
        // Return default tables if none found
        return ['users'];
      }

      return result.map((row: TableRow) => row.tablename);
    } catch (error) {
      Logger.error(`Error getting tables from template: ${error.message}`);
      // Return default tables on error
      return ['users'];
    }
  }

  async findAll() {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();

    try {
      return await ownerDS.getRepository(TenantEntity).find();
    } finally {
      await ownerDS.destroy();
    }
  }

  async deactivateTenant(id: number) {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();

    try {
      await ownerDS.getRepository(TenantEntity).update(id, { isActive: false });
      return { success: true, message: 'Tenant deactivated successfully' };
    } finally {
      await ownerDS.destroy();
    }
  }
}
