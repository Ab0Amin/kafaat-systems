// libs/shared/database/src/lib/config/database.config.ts
import 'reflect-metadata';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
// import { User } from '../entities/user.entity';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1478',
  database: process.env.DB_DATABASE || 'hr-core',
  //   entities: [User],
  entities: [join(__dirname, '../entities/**/*.entity{.ts,.js}')],
  synchronize: process.env.NODE_ENV !== 'production', // Only for development
  //   synchronize: true, // Only for development
  logging: process.env.NODE_ENV !== 'production',
};

// Export a configured data source for migrations and CLI
export const dataSource = new DataSource(databaseConfig);
