import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  createTenantDataSource,
  getDataSourceOptions,
} from '@kafaat-systems/database';
import { AdminEntity, RoleType, TenantEntity } from '@kafaat-systems/entities';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@kafaat-systems/entities';
import { TemplateSchemaService } from '../common/services/template-schema.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    private dataSource: DataSource,
    private templateSchemaService: TemplateSchemaService
  ) {}
  private readonly logger = new Logger(TenantService.name);

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
    this.logger.log(
      `Registering new tenant: ${dto.name} with schema: ${schemaName}`
    );

    // Check if schema already exists
    const existing = await this.dataSource.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
      [schemaName]
    );

    if (existing.length > 0) {
      throw new BadRequestException(`Schema "${schemaName}" already exists.`);
    }

    // Check if domain is already in use
    const existingTenant = await this.getTenantByDomain(dto.domain);
    if (existingTenant) {
      throw new BadRequestException(
        `Domain "${dto.domain}" is already in use.`
      );
    }

    // Create schema
    this.logger.log(`Creating schema: ${schemaName}`);
    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    // Initialize tenant data source
    const tenantDS = createTenantDataSource(schemaName);
    await tenantDS.initialize();

    try {
      // Clone template schema tables to the new schema
      this.logger.log(`Cloning template schema to: ${schemaName}`);
      await this.templateSchemaService.cloneTemplateToSchema(schemaName);

      // Create admin user for the tenant
      this.logger.log(`Creating admin user for tenant: ${dto.name}`);
      const passwordHash = await bcrypt.hash(dto.admin.password, 10);

      await tenantDS.getRepository(AdminEntity).save({
        firstName: dto.admin.fullName.split(' ')[0],
        lastName: dto.admin.fullName.split(' ').slice(1).join(' '),
        email: dto.admin.email,
        passwordHash,
        isActive: true,
        role: RoleType.ADMIN,
        schemaName: schemaName,
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
          contactEmail: dto.admin.email,
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
