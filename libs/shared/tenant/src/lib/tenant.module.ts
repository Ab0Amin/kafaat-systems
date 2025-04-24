import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { DatabaseModule } from '@kafaat-systems/database';
import { TenantMiddleware } from './midilwares/tenant.middlewar';
import { SubdomainMiddleware } from './midilwares/subdomain.middleware';
import { TemplateSchemaService } from './services/template-schema.service';
import { SchemaConfigModule } from '@kafaat-systems/schemaConfig';

@Module({
  imports: [
    DatabaseModule,
    SchemaConfigModule,
  ],
  providers: [
    TenantService, 
    TenantMiddleware,
    SubdomainMiddleware,
    TemplateSchemaService,
  ],
  exports: [
    TenantService,
    TenantMiddleware,
    SubdomainMiddleware,
  ],
})
export class SharedTenantModule {}
