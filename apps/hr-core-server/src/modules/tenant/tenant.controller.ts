import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

// This would be your actual auth guard
// import { AdminGuard } from '../../guards/admin.guard';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('register')
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.registerTenant(createTenantDto);
  }

  // @UseGuards(AdminGuard) // Uncomment when you have the guard
  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  // @UseGuards(AdminGuard) // Uncomment when you have the guard
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(+id);
  }

  // @UseGuards(AdminGuard) // Uncomment when you have the guard
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantService.update(+id, updateTenantDto);
  }

  // @UseGuards(AdminGuard) // Uncomment when you have the guard
  @Post(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.tenantService.deactivateTenant(+id);
  }

  // @UseGuards(AdminGuard) // Uncomment when you have the guard
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantService.remove(+id);
  }
}
