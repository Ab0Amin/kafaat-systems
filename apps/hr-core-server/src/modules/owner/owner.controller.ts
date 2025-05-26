import { Controller, Get, Post, Param, Body, Delete, Put } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateTenantDto } from './dto/create-tenant.dto';

@ApiTags('Owner')
@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Post('register')
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.ownerService.createNewTenant(createTenantDto);
  }

  @Post('migrations/run-all')
  runMigrationsForAllTenants() {
    return this.ownerService.runMigrationForAllTenants();
  }

  @Get('stats')
  getTenantStats() {
    return this.ownerService.getTenantStats();
  }

  @Get('tenants')
  getTenans() {
    return this.ownerService.getTenants();
  }

  @Put('tenants/:id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.ownerService.deactivateTenant(id);
  }
  @Put('tenants/:id/activate')
  activate(@Param('id') id: string) {
    return this.ownerService.activateTenant(id);
  }

  @Delete('tenants/:id/delete')
  deleteTenant(@Param('id') id: string) {
    return this.ownerService.deleteTenant(id);
  }
}
