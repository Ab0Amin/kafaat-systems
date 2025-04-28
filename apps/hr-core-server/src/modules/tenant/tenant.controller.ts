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
import { CreateTenantDto } from './dto/create-tenant.dto';
// import { UpdateTenantDto } from './dto/update-tenant.dto';
import { ApiTags } from '@nestjs/swagger';
import { TenantService } from './tenant.service';

// This would be your actual auth guard
// import { AdminGuard } from '../../guards/admin.guard';
@ApiTags('Tenant')
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  // @UseGuards(AdminGuard) // Uncomment when you have the guard
  @Get()
  findAll() {
    return this.tenantService.findAll();
  }
}
