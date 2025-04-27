import { Module } from '@nestjs/common';
import { TenantContextService } from './services/tenant-context.service.js';
import { TenantConfigService } from './services/tenant-config.service.js';

@Module({
  providers: [TenantContextService, TenantConfigService],
  exports: [TenantContextService, TenantConfigService],
})
export class TenantContextModule {}
