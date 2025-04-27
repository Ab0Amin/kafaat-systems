import { DataSource } from 'typeorm';
import { getDefaultDatabaseOptions } from '../config/database.config';

const dataSourceCache = new Map<string, DataSource>();

export const createTenantDataSource = (schema: string): DataSource => {
  if (dataSourceCache.has(schema)) {
    const existing = dataSourceCache.get(schema)!;
    return existing;
  }

  const options = getDefaultDatabaseOptions();

  const newDataSource = new DataSource({
    ...options,
    schema,
    name: `tenant-${schema}`,
    migrations: ['libs/shared/database/src/lib/migrations/*.ts'],
    migrationsRun: false,
  });

  dataSourceCache.set(schema, newDataSource);
  return newDataSource;
};
