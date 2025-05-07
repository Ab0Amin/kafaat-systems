import { Controller, Get, Post, Param, Body, Delete, Logger, Put } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Public } from '../common/decorators/public.decorator';
import { log } from 'node:console';

// This would be your actual auth guard
// import { AdminGuard } from '../../guards/admin.guard';
@ApiTags('Owner')
@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  // @UseGuards(dminGuard)A // Uncomment when you have the guard
  @Public() //till we have roles and guards
  @Post('register')
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.ownerService.createNewTenant(createTenantDto);
  }

  // @UseGuards(dminGuard)A // Uncomment when you have the guard
  @Post('migrations/run-all')
  runMigrationsForAllTenants() {
    return this.ownerService.runMigrationForAllTenants();
  }

  // @UseGuards(AdminGuard) // Uncomment when you have the guard
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
