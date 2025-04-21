import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
// import { UpdateTenantDto } from './dto/update-tenant.dto';
import { DataSource } from 'typeorm';
import { createTenantDataSource } from '@kafaat-systems/database';
@Injectable()
export class TenantService {
  constructor(private dataSource: DataSource) {}

  async registerTenant(dto: CreateTenantDto) {
    const schemaName = this.slugify(dto.name);

    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    const tenantDS = createTenantDataSource(schemaName);
    await tenantDS.initialize();

    // await tenantDS.query(`SET search_path TO "${schemaName}"`);
    await tenantDS.runMigrations();

    await tenantDS.destroy();

    return { message: `Schema ${schemaName} created and migrated.` };
  }

  private slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, '_');
  }
  // create(createTenantDto: CreateTenantDto) {
  //   return 'This action adds a new tenant';
  // }
  findAll() {
    return `This action returns all tenant`;
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
