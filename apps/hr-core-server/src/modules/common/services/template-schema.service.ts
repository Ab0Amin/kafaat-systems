// import { Injectable, Logger } from '@nestjs/common';
// import { DataSource } from 'typeorm';

// // TODO: Move this to a config file
// const tablesNames = ['roles', 'users', 'reset_tokens'];

// @Injectable()
// export class TemplateSchemaService {
//   private readonly logger = new Logger(TemplateSchemaService.name);
//   // constructor() {}

//   //  Clone tables from template schema to target schema
//   async cloneTemplateToSchema(targetSchema: string, dataSource: DataSource): Promise<void> {
//     const config = {
//       tableNames: tablesNames,
//       schemaName: process.env.DB_COPY_SOURCE ?? 'public',
//       copyStructure: true,
//       copyData: true,
//       priority: 10,
//     };
//     // First clone enum types
//     const enums = await this.cloneEnumTypes(config.schemaName, targetSchema, dataSource);

//     this.logger.log(`Cloned ENUM types: ${enums.join(', ')}`);

//     for (const tableName of config.tableNames) {
//       await this.cloneTable(
//         config.schemaName,
//         tableName,
//         targetSchema,
//         config.copyStructure,
//         dataSource
//       );
//     }
//   }

//   //   Clone all ENUM types from source schema to target schema
//   private async cloneEnumTypes(
//     sourceSchema: string,
//     targetSchema: string,
//     dataSource: DataSource
//   ): Promise<string[]> {
//     const clonedEnums = [];

//     // Get a list of tables with enum columns from the source schema
//     const enumColumnsQuery = `
//       SELECT
//         t.relname AS table_name,
//         a.attname AS column_name,
//         pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type
//       FROM
//         pg_catalog.pg_attribute a
//         JOIN pg_catalog.pg_class t ON a.attrelid = t.oid
//         JOIN pg_catalog.pg_namespace n ON t.relnamespace = n.oid
//       WHERE
//         n.nspname = $1
//         AND a.attnum > 0
//         AND NOT a.attisdropped
//         AND pg_catalog.format_type(a.atttypid, a.atttypmod) LIKE '%_enum'
//     `;

//     const enumColumns = await dataSource.query(enumColumnsQuery, [sourceSchema]);

//     // For each enum column, get its values and create the equivalent in the target schema
//     for (const col of enumColumns) {
//       const tableName = col.table_name;
//       const columnName = col.column_name;
//       const enumTypeName = `${tableName}_${columnName}_enum`;

//       // Get enum values from the source schema
//       const enumValuesQuery = `
//         SELECT e.enumlabel
//         FROM pg_type t
//         JOIN pg_enum e ON t.oid = e.enumtypid
//         JOIN pg_namespace n ON n.oid = t.typnamespace
//         WHERE n.nspname = $1 AND t.typname = $2
//         ORDER BY e.enumsortorder
//       `;

//       const enumValuesResult = await dataSource.query(enumValuesQuery, [
//         sourceSchema,
//         enumTypeName,
//       ]);

//       if (enumValuesResult.length > 0) {
//         // Format the enum values for the CREATE TYPE statement
//         interface EnumRow {
//           enumlabel: string;
//         }
//         const enumValues: string = (enumValuesResult as EnumRow[])
//           .map((row: EnumRow) => `'${row.enumlabel}'`)
//           .join(', ');

//         // Check if enum already exists in target schema
//         const targetEnumTypeName = `${tableName}_${columnName}_enum`;
//         const existsQuery = `
//           SELECT EXISTS (
//             SELECT 1 FROM pg_type t
//             JOIN pg_namespace n ON n.oid = t.typnamespace
//             WHERE t.typname = $1 AND n.nspname = $2
//           )
//         `;

//         const existsResult = await dataSource.query(existsQuery, [
//           targetEnumTypeName,
//           targetSchema,
//         ]);

//         if (!existsResult[0].exists) {
//           this.logger.log(`Creating enum ${targetSchema}.${targetEnumTypeName}`);
//           try {
//             await dataSource.query(
//               `CREATE TYPE "${targetSchema}"."${targetEnumTypeName}" AS ENUM (${enumValues})`
//             );
//             clonedEnums.push(targetEnumTypeName);
//           } catch (error) {
//             this.logger.error(
//               `Error creating enum ${targetSchema}.${targetEnumTypeName}: ${
//                 error instanceof Error ? error.message : 'Unknown error'
//               }`
//             );
//           }
//         } else {
//           this.logger.log(`Enum ${targetSchema}.${targetEnumTypeName} already exists`);
//         }
//       }
//     }

//     return clonedEnums;
//   }
//   //   Clone a single table from source schema to target schema
//   private async cloneTable(
//     sourceSchema: string,
//     tableName: string,
//     targetSchema: string,
//     copyStructure: boolean,
//     dataSource: DataSource
//   ): Promise<void> {
//     try {
//       // Check if source table exists
//       const tableExists = await this.checkTableExists(sourceSchema, tableName, dataSource);

//       if (!tableExists) {
//         this.logger.warn(`Source table ${sourceSchema}.${tableName} does not exist, skipping`);
//         return;
//       }

//       // Check if target table already exists
//       const targetTableExists = await this.checkTableExists(targetSchema, tableName, dataSource);

//       if (targetTableExists) {
//         this.logger.warn(
//           `Target table ${targetSchema}.${tableName} already exists, skipping structure creation`
//         );
//       } else if (copyStructure) {
//         // Create table structure in target schema
//         this.logger.log(
//           `Creating table ${targetSchema}.${tableName} from ${sourceSchema}.${tableName}`
//         );
//         await dataSource.query(`
//           CREATE TABLE IF NOT EXISTS "${targetSchema}"."${tableName}"
//           (LIKE "${sourceSchema}"."${tableName}" INCLUDING ALL)
//         `);
//       }

//       // Copy data if requested and table was created
//       if (
//         (targetTableExists || copyStructure) &&
//         (await this.checkTableExists(targetSchema, tableName, dataSource))
//       ) {
//         // Check if target table has data
//         const hasData = await this.tableHasData(targetSchema, tableName, dataSource);

//         if (!hasData) {
//           this.logger.log(
//             `Copying data from ${sourceSchema}.${tableName} to ${targetSchema}.${tableName}`
//           );

//           // This way we avoid enum type conflicts
//           const sourceData = await dataSource.query(
//             `SELECT * FROM "${sourceSchema}"."${tableName}"`
//           );

//           if (sourceData.length > 0) {
//             // Get column names dynamically from the first row
//             const columns = Object.keys(sourceData[0]);

//             // For each row in the source data
//             for (const row of sourceData) {
//               const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
//               const columnList = columns.map(col => `"${col}"`).join(', ');
//               const values = columns.map(col => row[col]);

//               // Insert each row individually
//               await dataSource.query(
//                 `INSERT INTO "${targetSchema}"."${tableName}" (${columnList}) VALUES (${placeholders})`,
//                 values
//               );
//             }

//             this.logger.log(`Copied ${sourceData.length} rows to ${targetSchema}.${tableName}`);
//           } else {
//             this.logger.log(`No data to copy from ${sourceSchema}.${tableName}`);
//           }
//         } else {
//           this.logger.warn(
//             `Target table ${targetSchema}.${tableName} already has data, skipping data copy`
//           );
//         }
//       }
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'Unknown error';

//       this.logger.error(
//         `Error cloning table ${sourceSchema}.${tableName} to ${targetSchema}.${tableName}: ${message}`
//       );
//       throw error;
//     }
//   }

//   //   Check if a table exists in a schema
//   private async checkTableExists(
//     schema: string,
//     table: string,
//     dataSource: DataSource
//   ): Promise<boolean> {
//     const result = await dataSource.query(
//       `
//       SELECT EXISTS (
//         SELECT FROM information_schema.tables
//         WHERE table_schema = $1
//         AND table_name = $2
//       )
//     `,
//       [schema, table]
//     );

//     return result[0].exists;
//   }

//   //   Check if a table has any data
//   private async tableHasData(
//     schema: string,
//     table: string,
//     dataSource: DataSource
//   ): Promise<boolean> {
//     const result = await dataSource.query(`
//       SELECT EXISTS (
//         SELECT 1 FROM "${schema}"."${table}" LIMIT 1
//       )
//     `);

//     return result[0].exists;
//   }
// }
