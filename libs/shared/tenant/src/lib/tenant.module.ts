import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { DatabaseModule } from '@kafaat-systems/database';
import { TenantMiddleware } from './midilwares/tenant.middlewar';

@Module({
  imports: [DatabaseModule],
  providers: [TenantService, TenantMiddleware],
  exports: [TenantService],
})
export class SharedTenantModule {}
