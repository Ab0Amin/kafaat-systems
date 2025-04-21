import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
// import { UpdateTenantDto } from './dto/update-tenant.dto';
import { DataSource } from 'typeorm';
import {
  createTenantDataSource,
  getDataSourceOptions,
} from '@kafaat-systems/database';
import { Tenant } from '@kafaat-systems/database';

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
      WHERE schemaname = 'copyFromTemplate'
      AND tablename NOT LIKE 'pg_%'
      AND tablename NOT LIKE 'sql_%'
      AND tablename NOT LIKE '\\_%' ESCAPE '\\'
    `);

    return result.map((row: TableRow) => row.tablename);
  }
  async registerTenant(dto: CreateTenantDto) {
    const schemaName = this.slugify(dto.name);
    //  Check if schema already exists
    const existing = await this.dataSource.query(
      `
  SELECT schema_name
  FROM information_schema.schemata
  WHERE schema_name = $1
`,
      [schemaName]
    );

    if (existing.length > 0) {
      throw new BadRequestException(`Schema "${schemaName}" already exists.`);
    }
    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    const tenantDS = createTenantDataSource(schemaName);
    await tenantDS.initialize();

    // await tenantDS.runMigrations();

    for (let index = 0; index < tablesToCopy.length; index++) {
      const table = tablesToCopy[index];

      // create the table in the new schema
      await this.dataSource.query(`
        CREATE TABLE "${schemaName}"."${table}" (LIKE ${copyFromTemplate}."${table}" INCLUDING ALL)
      `);

      // copy the data from the public schema to the new schema
      await this.dataSource.query(`
        INSERT INTO "${schemaName}"."${table}"
        SELECT * FROM ${copyFromTemplate}."${table}"
      `);
    }

    await tenantDS.destroy();
    // savw the tenant in the owner schema
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();

    await ownerDS.getRepository(Tenant).save({
      name: dto.name,
      domain: dto.domain,
      schema_name: schemaName,
    });

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
