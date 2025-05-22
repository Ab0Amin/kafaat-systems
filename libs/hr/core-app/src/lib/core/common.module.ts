import { Module } from '@nestjs/common';
import { GetTenantByDomainUseCase } from './application/use-cases/get-tenant-by-domain.use-case';
import { CloneTemplateSchemaUseCase } from './application/use-cases/clone-template-schema.use-case';
import { SlugifyNameUseCase } from './application/use-cases/slugify-name.use-case';
import { CommonController } from './interface/controllers/common.controller';
import { UserAgentService } from './infrastructure/services/user-agent.service';

@Module({
  controllers: [CommonController],
  providers: [
    GetTenantByDomainUseCase,
    CloneTemplateSchemaUseCase,
    SlugifyNameUseCase,
    UserAgentService,
  ],
  exports: [
    GetTenantByDomainUseCase,
    CloneTemplateSchemaUseCase,
    SlugifyNameUseCase,
    UserAgentService,
  ],
})
export class CommonModule {}
