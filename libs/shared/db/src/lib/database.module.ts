import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { databaseConfig } from './config/database.config';

import { TenantContextService } from '@kafaat-systems/schemaConfig';
import { DataSourceOptions } from 'typeorm';
import { entities_name } from '@kafaat-systems/entities';
import { SchemaConfigModule } from '@kafaat-systems/schemaConfig';

type CustomTypeOrmOptions = DataSourceOptions & {
  schema?: string;
  poolSize?: number;
  connectTimeoutMS?: number;
};
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        SchemaConfigModule,
        TypeOrmModule.forRootAsync({
          imports: [SchemaConfigModule],
          useFactory: (
            tenantContext: TenantContextService
          ): CustomTypeOrmOptions => ({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            // ...databaseConfig,
            entities: entities_name,
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV !== 'production',
            schema:
              tenantContext.getSchema() || process.env.DB_SCHEMA || 'public',
            poolSize: 20, // Adjust based on your needs
            connectTimeoutMS: 10000,
          }),
          inject: [TenantContextService],
        }),
      ],
    };
  }
}
