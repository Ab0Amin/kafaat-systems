import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { DatabaseModule } from '@kafaat-systems/database';
import { TemplateSchemaService } from './services/template-schema.service';
import { SchemaConfigModule } from '@kafaat-systems/schemaConfig';

@Module({
  imports: [DatabaseModule, SchemaConfigModule],
  providers: [TenantService, TemplateSchemaService],
  exports: [TenantService],
})
export class SharedTenantModule {}
