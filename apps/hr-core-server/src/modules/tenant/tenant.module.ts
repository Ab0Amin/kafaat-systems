import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantModule as SharedTenantModule } from '@kafaat-systems/libs';

@Module({
  imports: [SharedTenantModule],
  controllers: [TenantController],
})
export class TenantModule {}
