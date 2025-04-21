import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
// import { UpdateTenantDto } from './dto/update-tenant.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class TenantService {
  constructor(private dataSource: DataSource) {}

  async registerTenant(dto: CreateTenantDto) {
    const schemaName = this.slugify(dto.name);

    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    // هنا لاحقًا هنضيف الخطوات: migration + seeding

    return { message: `Schema ${schemaName} created.` };
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
