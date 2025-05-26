import { Module } from '@nestjs/common';
import { CloneTemplateSchemaUseCase } from './core/application/use-cases/clone-template-schema.use-case';
import { SlugifyNameUseCase } from './core/application/use-cases/slugify-name.use-case';

@Module({
  controllers: [],
  providers: [CloneTemplateSchemaUseCase, SlugifyNameUseCase],
  exports: [CloneTemplateSchemaUseCase, SlugifyNameUseCase],
})
export class CoreAppModule {}
