// libs/shared/src/lib/config/typeorm.config.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';

// For CLI and migrations
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1478',
  database: process.env.DB_DATABASE || 'hr-core',
  // Explicitly list all entities for now
  entities: [join(__dirname, '../entities/**/*.entity{.ts,.js}')],
  //   entities: [User],
  // For migrations
  migrations: [join(__dirname, '../migrations/**/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  synchronize: false, // Always false for migrations
});

export default dataSource;
