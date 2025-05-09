import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
// import { TenantService } from './services/';
// import { DatabaseModule } from '@kafaat-systems/database';
import { TenantMiddleware } from './midilwares/tenant.middlewar';
import { SubdomainMiddleware } from './midilwares/subdomain.middleware';
import { TemplateSchemaService } from './services/template-schema.service';
import { SubdomainService } from './services/subdomain.service';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { UserAgentService } from './services/user-agent.service';

@Module({
  imports: [],
  // imports: [DatabaseModule],
  controllers: [CommonController],
  providers: [
    CommonService,
    //  TenantService,
    TenantMiddleware,
    SubdomainMiddleware,
    TemplateSchemaService,
    SubdomainService,
    TenantContextService,
    UserAgentService,
  ],
  exports: [
    // TenantService,
    TenantMiddleware,
    SubdomainMiddleware,
    SubdomainService,
    TenantContextService,
    TemplateSchemaService,
  ],
})
export class CommonModule {}
