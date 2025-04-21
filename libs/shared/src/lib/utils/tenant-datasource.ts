// libs/shared/src/lib/utils/tenant-datasource.ts

import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const createTenantDataSource = (schema: string) => {
  const config = databaseConfig as PostgresConnectionOptions;
  return new DataSource({
    ...config,
    schema,
    name: `tenant-${schema}`,
    migrations: ['libs/shared/src/lib/migrations/*.ts'],
    migrationsRun: false,
    migrationsTableName: 'migrations',
  });
};
