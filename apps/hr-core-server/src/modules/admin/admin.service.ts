import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AdminEntity, RoleType, TenantEntity } from '@kafaat-systems/entities';
import { createTenantDataSource } from '@kafaat-systems/database';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { SubdomainService } from '../common/services/subdomain.service';
import { TemplateSchemaService } from '../common/services/template-schema.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    private dataSource: DataSource,
    private readonly subdomainService: SubdomainService,
    private templateSchemaService: TemplateSchemaService
  ) {}

  async runMigrationForAllTenants() {
    // Get all active tenants

    const ownerDS = createTenantDataSource('owner');
    await ownerDS.initialize();

    try {
      const tenants = await ownerDS.getRepository(TenantEntity).find({
        where: { isActive: true },
      });

      const results = [];

      // Run migrations for each tenant
      for (const tenant of tenants) {
        try {
          const tenantDS = createTenantDataSource(tenant.schema_name);
          await tenantDS.initialize();

          try {
            await tenantDS.runMigrations();
            results.push({
              tenant: tenant.name,
              schema: tenant.schema_name,
              success: true,
            });
          } catch (error: unknown) {
            results.push({
              tenant: tenant.name,
              schema: tenant.schema_name,
              success: false,
              error: error instanceof Error ? error.message : String(error),
            });
          } finally {
            await tenantDS.destroy();
          }
        } catch (error: unknown) {
          results.push({
            tenant: tenant.name,
            schema: tenant.schema_name,
            success: false,
            error:
              error instanceof Error
                ? `Failed to initialize connection: ${error.message}`
                : String(error),
          });
        }
      }

      return {
        totalTenants: tenants.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        details: results,
      };
    } finally {
      await ownerDS.destroy();
    }
  }

  async getTenantStats() {
    const ownerDS = createTenantDataSource('owner');
    await ownerDS.initialize();
    try {
      const tenants = await ownerDS.getRepository(TenantEntity).find();

      const stats = {
        totalTenants: tenants.length,
        activeTenants: tenants.filter((t) => t.isActive).length,
        inactiveTenants: tenants.filter((t) => !t.isActive).length,
        tenantsByPlan: tenants.reduce((acc, tenant) => {
          acc[tenant.plan || 'default'] =
            (acc[tenant.plan || 'default'] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };

      return stats;
    } finally {
      await ownerDS.destroy();
    }
  }

  async deactivateTenant(id: number) {
    const ownerDS = createTenantDataSource('owner');
    await ownerDS.initialize();

    try {
      await ownerDS.getRepository(TenantEntity).update(id, { isActive: false });
      return { success: true, message: 'Tenant deactivated successfully' };
    } finally {
      await ownerDS.destroy();
    }
  }

  async createNewTenant(dto: CreateTenantDto) {
    const schemaName = this.subdomainService.slugify(dto.domain);

    // Create schema
    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    // Initialize tenant data source
    const tenantDS = createTenantDataSource(schemaName);
    if (!tenantDS.isInitialized) {
      await tenantDS.initialize();
    }

    try {
      // Clone template schema tables to the new schema
      await this.templateSchemaService.cloneTemplateToSchema(schemaName);

      // Create admin user for the tenant
      const passwordHash = await bcrypt.hash(dto.admin.password, 10);

      await tenantDS.getRepository(AdminEntity).save({
        firstName: dto.admin.firstName,
        lastName: dto.admin.lastName,
        email: dto.admin.email,
        passwordHash,
        isActive: true,
        role: RoleType.ADMIN,
        schemaName: schemaName,
      });

      // Save tenant info in owner schema
      const ownerDS = createTenantDataSource('owner');
      if (!ownerDS.isInitialized) {
        await ownerDS.initialize();
      }

      try {
        await ownerDS.getRepository(TenantEntity).save({
          name: dto.name,
          domain: dto.domain,
          schema_name: schemaName,
          isActive: true,
          contactEmail: dto.admin.email,
          plan: dto.plan,
          phone: dto.contactPhone,
          maxUsers: dto.maxUsers,
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
}
