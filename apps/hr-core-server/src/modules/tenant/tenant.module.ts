import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TemplateSchemaService } from '../common/services/template-schema.service';
import { DatabaseModule } from '@kafaat-systems/database';
import { SchemaConfigModule } from '@kafaat-systems/schemaConfig';

@Module({
  imports: [DatabaseModule, SchemaConfigModule],
  controllers: [TenantController],
  providers: [TenantService, TemplateSchemaService],
})
export class TenantModule {}
