import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TenantContextService,
  TenantContextModule,
} from '@kafaat-systems/tenant-context';
import { getDefaultDatabaseOptions } from './config/database.config';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TenantContextModule,
        TypeOrmModule.forRootAsync({
          imports: [TenantContextModule],
          useFactory: (tenantContext: TenantContextService) => ({
            ...getDefaultDatabaseOptions(),
            schema:
              tenantContext.getSchema() || process.env.DB_SCHEMA || 'public',
          }),
          inject: [TenantContextService],
        }),
      ],
    };
  }
}
