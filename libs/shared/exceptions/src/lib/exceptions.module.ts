import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

export interface ExceptionsModuleOptions {
  isProduction?: boolean;
  logErrors?: boolean;
  logStackTrace?: boolean;
}

const defaultOptions: ExceptionsModuleOptions = {
  isProduction: process.env.NODE_ENV === 'production',
  logErrors: true,
  logStackTrace: process.env.NODE_ENV !== 'production',
};

@Global()
@Module({})
export class ExceptionsModule {
  static forRoot(options: ExceptionsModuleOptions = {}): DynamicModule {
    const mergedOptions = { ...defaultOptions, ...options };

    const providers: Provider[] = [
      {
        provide: 'EXCEPTIONS_MODULE_OPTIONS',
        useValue: mergedOptions,
      },
      {
        provide: APP_FILTER,
        useClass: AllExceptionsFilter,
      },
    ];

    return {
      module: ExceptionsModule,
      providers,
      exports: providers,
    };
  }
}