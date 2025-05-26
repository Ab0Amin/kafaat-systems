import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class DatabaseException extends BaseException {
  constructor(
    message = 'Database Error',
    options?: {
      code?: string;
      details?: Record<string, any>;
      originalError?: any;
    }
  ) {
    let errorCode = options?.code || 'DATABASE_ERROR';
    let errorDetails = options?.details || {};
    
    // Handle specific PostgreSQL errors
    if (options?.originalError?.code) {
      const pgError = options.originalError;
      
      switch (pgError.code) {
        case '23505': // unique_violation
          errorCode = 'DUPLICATE_ENTRY';
          errorDetails = { 
            ...errorDetails,
            constraint: pgError.constraint,
            detail: pgError.detail
          };
          break;
        case '23503': // foreign_key_violation
          errorCode = 'FOREIGN_KEY_VIOLATION';
          errorDetails = { 
            ...errorDetails,
            constraint: pgError.constraint,
            detail: pgError.detail
          };
          break;
        case '42P01': // undefined_table
          errorCode = 'TABLE_NOT_FOUND';
          errorDetails = { 
            ...errorDetails,
            table: pgError.table
          };
          break;
        // Add more specific error codes as needed
      }
    }
    
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, {
      code: errorCode,
      details: errorDetails,
    });
  }
}