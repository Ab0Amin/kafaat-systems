// libs/shared/database/src/lib/database.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { entities_name } from '@kafaat-systems/database';
import { TenantContextService } from './services/tenant-context.service';
import { TenantService } from './services/tenant.service';
import { TenantConfigService } from './services/tenant-config.service';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (tenantContext: TenantContextService): TypeOrmModuleOptions => ({
            ...databaseConfig,
            entities: entities_name,
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV !== 'production',
            schema: tenantContext.getSchema() || process.env.DB_SCHEMA || 'public',
            poolSize: 20, // Adjust based on your needs
            connectTimeoutMS: 10000,
          }),
          inject: [TenantContextService],
        }),
      ],
      providers: [TenantContextService, TenantService, TenantConfigService],
      exports: [TenantContextService, TenantService, TenantConfigService],
    };
  }
}
