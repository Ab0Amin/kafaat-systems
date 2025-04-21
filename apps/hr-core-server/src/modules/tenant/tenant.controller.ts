import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
// import { UpdateTenantDto } from './dto/update-tenant.dto';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  // @Post('register')
  // async registerCompany(@Body() dto: RegisterCompanyDto) {
  //   return this.tenantService.registerTenant(dto);
  // }

  @Post('register')
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.registerTenant(createTenantDto);
  }

  @Get('register')
  findAll() {
    return this.tenantService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tenantService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
  //   return this.tenantService.update(+id, updateTenantDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tenantService.remove(+id);
  // }
}
