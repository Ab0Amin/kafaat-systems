import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tenant } from '@kafaat-systems/database';
import { getDataSourceOptions, createTenantDataSource } from '@kafaat-systems/database';

@Injectable()
export class AdminService {
  constructor(private dataSource: DataSource) {}
  
  async runMigrationForAllTenants() {
    // Get all active tenants
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();
    
    try {
      const tenants = await ownerDS.getRepository(Tenant).find({ 
        where: { isActive: true } 
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
              success: true 
            });
          } catch (error) {
            results.push({ 
              tenant: tenant.name, 
              schema: tenant.schema_name, 
              success: false, 
              error: error.message 
            });
          } finally {
            await tenantDS.destroy();
          }
        } catch (error) {
          results.push({ 
            tenant: tenant.name, 
            schema: tenant.schema_name, 
            success: false, 
            error: `Failed to initialize connection: ${error.message}` 
          });
        }
      }
      
      return {
        totalTenants: tenants.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        details: results
      };
    } finally {
      await ownerDS.destroy();
    }
  }
  
  async getTenantStats() {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();
    
    try {
      const tenants = await ownerDS.getRepository(Tenant).find();
      
      const stats = {
        totalTenants: tenants.length,
        activeTenants: tenants.filter(t => t.isActive).length,
        inactiveTenants: tenants.filter(t => !t.isActive).length,
        tenantsByPlan: tenants.reduce((acc, tenant) => {
          acc[tenant.plan || 'default'] = (acc[tenant.plan || 'default'] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      
      return stats;
    } finally {
      await ownerDS.destroy();
    }
  }
}