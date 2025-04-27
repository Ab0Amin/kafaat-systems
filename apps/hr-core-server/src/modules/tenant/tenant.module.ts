import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TemplateSchemaService } from '../common/services/template-schema.service';
import { DatabaseModule } from '@kafaat-systems/database';

@Module({
  imports: [DatabaseModule],
  controllers: [TenantController],
  providers: [TenantService, TemplateSchemaService],
})
export class TenantModule {}
