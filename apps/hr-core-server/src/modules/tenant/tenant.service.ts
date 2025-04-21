import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { DataSource } from 'typeorm';
import {
  createTenantDataSource,
  getDataSourceOptions,
} from '@kafaat-systems/database';
import { Tenant, User } from '@kafaat-systems/database';
import * as bcrypt from 'bcrypt';

interface TableRow {
  tablename: string;
}
const tablesToCopy = ['users'];
const copyFromTemplate = 'public';

@Injectable()
export class TenantService {
  constructor(private dataSource: DataSource) {}
  
  async getTablesFromTemplate(): Promise<string[]> {
    const result = await this.dataSource.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = '${copyFromTemplate}'
      AND tablename NOT LIKE 'pg_%'
      AND tablename NOT LIKE 'sql_%'
      AND tablename NOT LIKE '\\_%' ESCAPE '\\'
    `);

    return result.map((row: TableRow) => row.tablename);
  }
  
  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();
    
    try {
      const tenant = await ownerDS.getRepository(Tenant).findOne({ 
        where: { domain, isActive: true } 
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
      
      // Copy template tables if needed
      for (let index = 0; index < tablesToCopy.length; index++) {
        const table = tablesToCopy[index];

        // Create the table in the new schema
        await this.dataSource.query(`
          CREATE TABLE IF NOT EXISTS "${schemaName}"."${table}" (LIKE ${copyFromTemplate}."${table}" INCLUDING ALL)
        `);

        // Copy the data from the public schema to the new schema if needed
        // We'll skip this for now as we'll create a new admin user instead
      }
      
      // Create admin user for the tenant
      if (dto.admin) {
        const passwordHash = await bcrypt.hash(dto.admin.password, 10);
        
        const firstName = dto.admin.fullName.split(' ')[0];
        const lastName = dto.admin.fullName.split(' ').slice(1).join(' ') || '';
        
        await tenantDS.getRepository(User).save({
          firstName,
          lastName,
          email: dto.admin.email,
          passwordHash,
          isActive: true,
        });
      }
      
      // Save tenant info in owner schema
      const ownerDS = new DataSource(getDataSourceOptions('owner'));
      await ownerDS.initialize();
      
      try {
        await ownerDS.getRepository(Tenant).save({
          name: dto.name,
          domain: dto.domain,
          schema_name: schemaName,
          isActive: true,
          plan: 'free', // Default plan
          contactEmail: dto.admin?.email,
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
          schema: schemaName
        }
      };
    } catch (error) {
      // Rollback on error
      await this.dataSource.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
      throw new BadRequestException(`Failed to register tenant: ${error.message}`);
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
  
  async findOne(id: number) {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();
    
    try {
      return await ownerDS.getRepository(Tenant).findOne({ where: { id } });
    } finally {
      await ownerDS.destroy();
    }
  }
  
  async update(id: number, updateTenantDto: UpdateTenantDto) {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();
    
    try {
      await ownerDS.getRepository(Tenant).update(id, updateTenantDto);
      return { success: true, message: 'Tenant updated successfully' };
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
  
  async remove(id: number) {
    // Get tenant info first
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();
    
    try {
      const tenant = await ownerDS.getRepository(Tenant).findOne({ where: { id } });
      
      if (!tenant) {
        throw new BadRequestException(`Tenant with ID ${id} not found`);
      }
      
      // Drop the schema
      await this.dataSource.query(`DROP SCHEMA IF EXISTS "${tenant.schema_name}" CASCADE`);
      
      // Remove from owner schema
      await ownerDS.getRepository(Tenant).delete(id);
      
      return { success: true, message: `Tenant ${tenant.name} removed successfully` };
    } finally {
      await ownerDS.destroy();
    }
  }
}
