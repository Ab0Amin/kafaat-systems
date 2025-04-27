import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface TableInfo {
  tableNames: Array<string>;
  schemaName: string;
  copyStructure: boolean;
  copyData: boolean;
  priority: number;
}
// TODO: Move this to a config file
const tablesNames = ['roles', 'users'];

@Injectable()
export class TemplateSchemaService {
  private readonly logger = new Logger(TemplateSchemaService.name);
  constructor(private dataSource: DataSource) {}

  /**
   * Clone tables from template schema to target schema
   */
  async cloneTemplateToSchema(targetSchema: string): Promise<void> {
    const config = {
      tableNames: tablesNames,
      schemaName: process.env.DB_COPY_SOURCE ?? 'public',
      copyStructure: true,
      copyData: true,
      priority: 10,
    };

    for (const tableName of config.tableNames) {
      await this.cloneTable(
        config.schemaName,
        tableName,
        targetSchema,
        config.copyStructure
      );
    }
  }

  /**
   * Clone a single table from source schema to target schema
   */
  private async cloneTable(
    sourceSchema: string,
    tableName: string,
    targetSchema: string,
    copyStructure: boolean
  ): Promise<void> {
    try {
      // Check if source table exists
      const tableExists = await this.checkTableExists(sourceSchema, tableName);

      if (!tableExists) {
        this.logger.warn(
          `Source table ${sourceSchema}.${tableName} does not exist, skipping`
        );
        return;
      }

      // Check if target table already exists
      const targetTableExists = await this.checkTableExists(
        targetSchema,
        tableName
      );

      if (targetTableExists) {
        this.logger.warn(
          `Target table ${targetSchema}.${tableName} already exists, skipping structure creation`
        );
      } else if (copyStructure) {
        // Create table structure in target schema
        // this.logger.debug(
        //   `Creating table ${targetSchema}.${tableName} from ${sourceSchema}.${tableName}`
        // );
        await this.dataSource.query(`
          CREATE TABLE IF NOT EXISTS "${targetSchema}"."${tableName}" 
          (LIKE "${sourceSchema}"."${tableName}" INCLUDING ALL)
        `);
      }

      // Copy data if requested and table was created
      if (targetTableExists || copyStructure) {
        // this.logger.debug(
        //   `Copying data from ${sourceSchema}.${tableName} to ${targetSchema}.${tableName}`
        // );

        // Check if target table has data
        const hasData = await this.tableHasData(targetSchema, tableName);

        if (!hasData) {
          // this.logger.warn(
          //   `Target table ${targetSchema}.${tableName} already has data, skipping data copy`
          // );
          // Copy data from source to target
          await this.dataSource.query(`
            INSERT INTO "${targetSchema}"."${tableName}"
            SELECT * FROM "${sourceSchema}"."${tableName}"
          `);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      this.logger.error(
        `Error cloning table ${sourceSchema}.${tableName} to ${targetSchema}.${tableName}: ${message}`
      );
      throw error;
    }
  }

  /**
   * Check if a table exists in a schema
   */
  private async checkTableExists(
    schema: string,
    table: string
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = $1 
        AND table_name = $2
      )
    `,
      [schema, table]
    );

    return result[0].exists;
  }

  /**
   * Check if a table has any data
   */
  private async tableHasData(schema: string, table: string): Promise<boolean> {
    const result = await this.dataSource.query(`
      SELECT EXISTS (
        SELECT 1 FROM "${schema}"."${table}" LIMIT 1
      )
    `);

    return result[0].exists;
  }
}
