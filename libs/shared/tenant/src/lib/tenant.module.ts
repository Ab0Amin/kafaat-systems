import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { DatabaseModule } from '@kafaat-systems/database';

@Module({
  imports: [DatabaseModule],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
