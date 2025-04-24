import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { DataSource } from 'typeorm';
import {
  createTenantDataSource,
  getDataSourceOptions,
} from '@kafaat-systems/database';
import { Admin, Tenant, RoleType } from '@kafaat-systems/entities';
import * as bcrypt from 'bcrypt';
import { TemplateSchemaService } from './services/template-schema.service';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);

  constructor(
    private dataSource: DataSource,
    private templateSchemaService: TemplateSchemaService,
  ) {}

  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();

    try {
      const tenant = await ownerDS.getRepository(Tenant).findOne({
        where: { domain, isActive: true },
      });
      return tenant;
    } catch (error) {
      this.logger.error(`Error getting tenant by domain ${domain}: ${error.message}`);
      return null;
    } finally {
      await ownerDS.destroy();
    }
  }

  async registerTenant(dto: CreateTenantDto) {
    const schemaName = this.slugify(dto.name);
    this.logger.log(`Registering new tenant: ${dto.name} with schema: ${schemaName}`);

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
      throw new BadRequestException(`Domain "${dto.domain}" is already in use.`);
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

      await tenantDS.getRepository(Admin).save({
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
        await ownerDS.getRepository(Tenant).save({
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
      return await ownerDS.getRepository(Tenant).find();
    } catch (error) {
      this.logger.error(`Error finding all tenants: ${error.message}`);
      return [];
    } finally {
      await ownerDS.destroy();
    }
  }

  async deactivateTenant(id: number) {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();

    try {
      const tenant = await ownerDS.getRepository(Tenant).findOne({ where: { id } });
      
      if (!tenant) {
        throw new BadRequestException(`Tenant with ID ${id} not found`);
      }
      
      this.logger.log(`Deactivating tenant: ${tenant.name} (${tenant.schema_name})`);
      await ownerDS.getRepository(Tenant).update(id, { 
        isActive: false,
        updatedAt: new Date()
      });
      
      return { 
        success: true, 
        message: `Tenant ${tenant.name} deactivated successfully` 
      };
    } catch (error) {
      this.logger.error(`Error deactivating tenant ${id}: ${error.message}`);
      throw error;
    } finally {
      await ownerDS.destroy();
    }
  }
  
  async getTenantById(id: number): Promise<Tenant | null> {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();

    try {
      const tenant = await ownerDS.getRepository(Tenant).findOne({
        where: { id },
      });
      return tenant;
    } catch (error) {
      this.logger.error(`Error getting tenant by ID ${id}: ${error.message}`);
      return null;
    } finally {
      await ownerDS.destroy();
    }
  }
  
  async getTenantBySchema(schema: string): Promise<Tenant | null> {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();

    try {
      const tenant = await ownerDS.getRepository(Tenant).findOne({
        where: { schema_name: schema },
      });
      return tenant;
    } catch (error) {
      this.logger.error(`Error getting tenant by schema ${schema}: ${error.message}`);
      return null;
    } finally {
      await ownerDS.destroy();
    }
  }
}
