import { Module } from '@nestjs/common';
import { TenantContextService } from './services/tenant-context.service';
import { TenantConfigService } from './services/tenant-config.service';
import { SchemaAccessGuard } from './guards/schema-access.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    TenantContextService,
    TenantConfigService,
    SchemaAccessGuard,
    {
      provide: APP_GUARD,
      useClass: SchemaAccessGuard,
    },
  ],
  exports: [TenantContextService, TenantConfigService, SchemaAccessGuard],
})
export class SchemaConfigModule {}
