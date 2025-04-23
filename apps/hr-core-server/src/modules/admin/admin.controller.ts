import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';

// This would be your actual auth guard
// import { AdminGuard } from '../../guards/admin.guard';

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
}
