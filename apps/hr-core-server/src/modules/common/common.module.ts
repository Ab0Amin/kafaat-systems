import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
// import { TenantService } from './services/';
import { DatabaseModule } from '@kafaat-systems/database';
import { TenantMiddleware } from './midilwares/tenant.middlewar';
import { SubdomainMiddleware } from './midilwares/subdomain.middleware';
import { TemplateSchemaService } from './services/template-schema.service';
import { SchemaConfigModule } from '@kafaat-systems/schemaConfig';
import { SubdomainService } from './services/subdomain.service';

@Module({
  controllers: [CommonController, DatabaseModule, SchemaConfigModule],
  providers: [
    CommonService,
    //  TenantService,
    TenantMiddleware,
    SubdomainMiddleware,
    TemplateSchemaService,
    SubdomainService,
  ],
  exports: [
    // TenantService,
    TenantMiddleware,
    SubdomainMiddleware,
    SubdomainService,
  ],
})
export class CommonModule {}
