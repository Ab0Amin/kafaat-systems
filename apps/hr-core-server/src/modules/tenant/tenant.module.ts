import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { SharedTenantModule } from '@kafaat-systems/tenant';

@Module({
  imports: [SharedTenantModule],
  controllers: [TenantController],
})
export class TenantModule {}
