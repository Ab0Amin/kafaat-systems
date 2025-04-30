import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantContextModule, TenantContextService } from '@kafaat-systems/tenant-context';
import { getDefaultDatabaseOptions } from '@kafaat-systems/database';

@Module({})
export class DatabaseWithTenantModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseWithTenantModule,
      imports: [
        TenantContextModule,
        TypeOrmModule.forRootAsync({
          imports: [TenantContextModule],
          inject: [TenantContextService],
          useFactory: async (tenantContext: TenantContextService) => {
            const schema = tenantContext.getSchema() || 'public';

            return {
              ...getDefaultDatabaseOptions(),
              schema,
            };
          },
        }),
      ],
    };
  }
}
