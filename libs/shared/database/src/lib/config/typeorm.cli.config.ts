/* eslint-disable */
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

import { entities_name } from '../../../../entities/src/lib/entities-names';

dotenv.config();

export const getDataSourceOptions = (schema?: string): DataSourceOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: schema || process.env.DEFAULT_SCHEMA,
    synchronize: true,
    // synchronize: false, // Set to false in production
    logging: false,

    entities: entities_name,

    migrations: ['libs/shared/database/src/lib/migrations/*.ts'],
    migrationsTableName: 'migrations',
  };
};

// default export for CLI
export const dataSource_migration = new DataSource(getDataSourceOptions());
