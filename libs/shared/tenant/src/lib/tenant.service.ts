import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { DataSource } from 'typeorm';
import {
  createTenantDataSource,
  getDataSourceOptions,
} from '@kafaat-systems/database';
import { Tenant, User } from '@kafaat-systems/entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TenantService {
  constructor(private dataSource: DataSource) {}

  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();

    try {
      const tenant = await ownerDS.getRepository(Tenant).findOne({
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
      await tenantDS.runMigrations();

      // Create admin user for the tenant
      const passwordHash = await bcrypt.hash(dto.admin.password, 10);

      await tenantDS.getRepository(User).save({
        firstName: dto.admin.fullName.split(' ')[0],
        lastName: dto.admin.fullName.split(' ').slice(1).join(' '),
        email: dto.admin.email,
        passwordHash,
        isActive: true,
        roles: ['admin'],
      });

      // Save tenant info in owner schema
      const ownerDS = new DataSource(getDataSourceOptions('owner'));
      await ownerDS.initialize();

      try {
        await ownerDS.getRepository(Tenant).save({
          name: dto.name,
          domain: dto.domain,
          schema_name: schemaName,
          isActive: true,
          createdAt: new Date(),
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

  async findAll() {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();

    try {
      return await ownerDS.getRepository(Tenant).find();
    } finally {
      await ownerDS.destroy();
    }
  }

  async deactivateTenant(id: number) {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();

    try {
      await ownerDS.getRepository(Tenant).update(id, { isActive: false });
      return { success: true, message: 'Tenant deactivated successfully' };
    } finally {
      await ownerDS.destroy();
    }
  }
}
