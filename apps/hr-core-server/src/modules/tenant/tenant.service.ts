import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
// import { UpdateTenantDto } from './dto/update-tenant.dto';
import { DataSource } from 'typeorm';
import { createTenantDataSource } from '@kafaat-systems/database';

interface TableRow {
  tablename: string;
}
const tablesToCopy = ['users'];

@Injectable()
export class TenantService {
  constructor(private dataSource: DataSource) {}
  async getTablesFromTemplate(): Promise<string[]> {
    const result = await this.dataSource.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename NOT LIKE 'pg_%'
      AND tablename NOT LIKE 'sql_%'
      AND tablename NOT LIKE '\\_%' ESCAPE '\\'
    `);

    return result.map((row: TableRow) => row.tablename);
  }
  async registerTenant(dto: CreateTenantDto) {
    const schemaName = this.slugify(dto.name);

    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    const tenantDS = createTenantDataSource(schemaName);
    await tenantDS.initialize();

    await tenantDS.runMigrations();

    for (const table of tablesToCopy) {
      // create the table in the new schema
      await this.dataSource.query(`
        CREATE TABLE "${schemaName}"."${table}" (LIKE public."${table}" INCLUDING ALL)
      `);

      // copy the data from the public schema to the new schema
      await this.dataSource.query(`
        INSERT INTO "${schemaName}"."${table}"
        SELECT * FROM public."${table}"
      `);
    }

    await tenantDS.destroy();

    return { message: `Schema ${schemaName} created and migrated.` };
  }

  private slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, '_');
  }
  // create(createTenantDto: CreateTenantDto) {
  //   return 'This action adds a new tenant';
  // }
  async findAll() {
    const tablesToCopy = await this.getTablesFromTemplate();
    return tablesToCopy;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} tenant`;
  // }

  // update(id: number, updateTenantDto: UpdateTenantDto) {
  //   return `This action updates a #${id} tenant`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} tenant`;
  // }
}
