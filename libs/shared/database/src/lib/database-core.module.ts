import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDefaultDatabaseOptions } from './config/database.config';

@Module({})
export class DatabaseCoreModule {
  static forRoot(schema: string): DynamicModule {
    return {
      module: DatabaseCoreModule,
      imports: [
        TypeOrmModule.forRoot({
          ...getDefaultDatabaseOptions(),
          schema: schema || 'public',
        }),
      ],
    };
  }
}
