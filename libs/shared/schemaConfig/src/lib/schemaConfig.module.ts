import { Module } from '@nestjs/common';
import { TenantContextService } from './services/tenant-context.service';
import { TenantConfigService } from './services/tenant-config.service';

@Module({
  providers: [TenantContextService, TenantConfigService],
  exports: [TenantContextService, TenantConfigService],
})
export class SchemaConfigModule {}
