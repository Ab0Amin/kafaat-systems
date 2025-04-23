// libs/shared/database/src/lib/config/database.config.ts
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Export a configur/ed data source for migrations and CLI
export const dataSource = new DataSource(databaseConfig);
