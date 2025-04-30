import { Injectable } from '@nestjs/common';
import { CreateDatabaseWithTenantDto } from './dto/create-database-with-tenant.dto';
import { UpdateDatabaseWithTenantDto } from './dto/update-database-with-tenant.dto';

@Injectable()
export class DatabaseWithTenantService {
  create(createDatabaseWithTenantDto: CreateDatabaseWithTenantDto) {
    return 'This action adds a new databaseWithTenant';
  }

  findAll() {
    return `This action returns all databaseWithTenant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} databaseWithTenant`;
  }

  update(id: number, updateDatabaseWithTenantDto: UpdateDatabaseWithTenantDto) {
    return `This action updates a #${id} databaseWithTenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} databaseWithTenant`;
  }
}
