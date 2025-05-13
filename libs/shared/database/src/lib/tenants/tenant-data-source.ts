import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { getDefaultDatabaseOptions } from '../config/database.config';

const logger = new Logger('TenantDataSourceManager');

// Cache to store tenant-specific connections
const tenantConnectionMap = new Map<string, DataSource>();

/**
 * Create a new DataSource for a given tenant schema.
 * NOTE: This does NOT call initialize().
 */
export const createTenantDataSource = (schema: string): DataSource => {
  if (tenantConnectionMap.has(schema)) {
    const existing = tenantConnectionMap.get(schema);
    if (existing) return existing;
  }

  const options = getDefaultDatabaseOptions();

  const newDataSource = new DataSource({
    ...options,
    schema,
    name: `tenant-${schema}`,
    migrations: ['libs/shared/database/src/lib/migrations/*.ts'],
    migrationsRun: false,
  });

  tenantConnectionMap.set(schema, newDataSource);
  return newDataSource;
};

/**
 * Get a ready-to-use initialized DataSource.
 * It will create and initialize if not already connected.
 */
export const getTenantDataSource = async (schema: string): Promise<DataSource> => {
  let ds = tenantConnectionMap.get(schema);

  if (ds) {
    if (!ds.isInitialized) {
      logger.log(`🔌 Initializing existing DataSource for schema "${schema}"`);
      await ds.initialize();
    }
    return ds;
  }

  logger.log(`Creating and initializing DataSource for schema "${schema}"`);
  ds = createTenantDataSource(schema);
  await ds.initialize();
  tenantConnectionMap.set(schema, ds);

  return ds;
};

/**
 * Optional helper to log all active tenant schemas
 */
export const logTenantConnections = () => {
  const schemas = Array.from(tenantConnectionMap.keys());
  logger.log(` Active tenant schemas in cache: [${schemas.join(', ')}]`);
};

/**
 * Optional cleanup function to close all connections gracefully
 */
export const closeAllTenantConnections = async () => {
  for (const [schema, ds] of tenantConnectionMap.entries()) {
    if (ds.isInitialized) {
      await ds.destroy();
      logger.log(` Closed connection for schema "${schema}"`);
    }
  }
  tenantConnectionMap.clear();
};
// usage
// import { getTenantDataSource } from '@kafaat-systems/database'; // حسب alias عندك

// const schema = this.tenantContextService.getSchema();
// const ds = await getTenantDataSource(schema);
// const userRepo = ds.getRepository(UserEntity);
