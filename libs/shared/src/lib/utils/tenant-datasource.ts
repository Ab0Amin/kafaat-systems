import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { entities_name } from '@kafaat-systems/database';

export const createTenantDataSource = (schema: string) => {
  const config = databaseConfig as PostgresConnectionOptions;
  return new DataSource({
    ...config,
    schema,
    name: `tenant-${schema}`,
    entities: entities_name,
    migrations: ['libs/shared/src/lib/migrations/*.ts'],
    migrationsRun: false,
    migrationsTableName: 'migrations',
  });
};
