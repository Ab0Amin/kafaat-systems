import { DataSource } from 'typeorm';
import { getDefaultDatabaseOptions } from './database.config';

export const migrationDataSource = new DataSource({
  ...getDefaultDatabaseOptions(),
  migrations: ['libs/shared/database/src/lib/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
