import { Controller, Get, Post, UseGuards, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateTenantDto } from './dto/create-tenant.dto';

// This would be your actual auth guard
// import { AdminGuard } from '../../guards/admin.guard';
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @UseGuards(dminGuard)A // Uncomment when you have the guard
  @Post('register')
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.adminService.createNewTenant(createTenantDto);
  }

  // @UseGuards(dminGuard)A // Uncomment when you have the guard
  @Post('migrations/run-all')
  runMigrationsForAllTenants() {
    return this.adminService.runMigrationForAllTenants();
  }

  // @UseGuards(AdminGuard) // Uncomment when you have the guard
  @Get('stats')
  getTenantStats() {
    return this.adminService.getTenantStats();
  }

  @Post(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.adminService.deactivateTenant(+id);
  }
}
