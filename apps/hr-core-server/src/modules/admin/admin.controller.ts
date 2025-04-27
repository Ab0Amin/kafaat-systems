import { Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';

// This would be your actual auth guard
// import { AdminGuard } from '../../guards/admin.guard';
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @UseGuards(AdminGuard) // Uncomment when you have the guard
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
