import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatabaseWithTenantService } from './database-with-tenant.service';
import { CreateDatabaseWithTenantDto } from './dto/create-database-with-tenant.dto';
import { UpdateDatabaseWithTenantDto } from './dto/update-database-with-tenant.dto';

@Controller('database-with-tenant')
export class DatabaseWithTenantController {
  constructor(private readonly databaseWithTenantService: DatabaseWithTenantService) {}

  @Post()
  create(@Body() createDatabaseWithTenantDto: CreateDatabaseWithTenantDto) {
    return this.databaseWithTenantService.create(createDatabaseWithTenantDto);
  }

  @Get()
  findAll() {
    return this.databaseWithTenantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.databaseWithTenantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatabaseWithTenantDto: UpdateDatabaseWithTenantDto) {
    return this.databaseWithTenantService.update(+id, updateDatabaseWithTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.databaseWithTenantService.remove(+id);
  }
}
