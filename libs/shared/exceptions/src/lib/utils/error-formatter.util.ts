import { ValidationError } from '@nestjs/common';
import { ErrorResponse, ValidationErrorResponse } from '../interfaces/error-response.interface';

export class ErrorFormatter {
  static formatError(
    statusCode: number,
    message: string | string[],
    error: string,
    path: string,
    options?: {
      code?: string;
      details?: Record<string, any>;
      stack?: string;
    }
  ): ErrorResponse {
    return {
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path,
      code: options?.code,
      details: options?.details,
      stack: options?.stack,
    };
  }

  static formatValidationError(
    statusCode: number,
    message: string,
    error: string,
    path: string,
    validationErrors: ValidationError[],
    stack?: string
  ): ValidationErrorResponse {
    return {
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path,
      validationErrors: this.flattenValidationErrors(validationErrors),
      stack,
    };
  }

  static flattenValidationErrors(errors: ValidationError[]): any[] {
    return errors.map(error => {
      const constraints = error.constraints
        ? Object.values(error.constraints)
        : [];
      
      const children = error.children && error.children.length > 0
        ? this.flattenValidationErrors(error.children)
        : [];
      
      return {
        property: error.property,
        constraints: error.constraints || {},
        messages: constraints,
        children,
      };
    });
  }

  static formatDatabaseError(
    message: string,
    path: string,
    dbError: any,
    stack?: string
  ): ErrorResponse {
    let errorMessage = message;
    let errorCode = 'DB_ERROR';
    let details = {};

    // PostgreSQL specific error handling
    if (dbError.code) {
      switch (dbError.code) {
        case '23505': // unique_violation
          errorMessage = 'Duplicate entry found';
          errorCode = 'DUPLICATE_ENTRY';
          details = { constraint: dbError.constraint };
          break;
        case '23503': // foreign_key_violation
          errorMessage = 'Referenced record not found';
          errorCode = 'FOREIGN_KEY_VIOLATION';
          details = { constraint: dbError.constraint };
          break;
        case '42P01': // undefined_table
          errorMessage = 'Table not found';
          errorCode = 'TABLE_NOT_FOUND';
          break;
        case '42703': // undefined_column
          errorMessage = 'Column not found';
          errorCode = 'COLUMN_NOT_FOUND';
          break;
      }
    }

    return this.formatError(
      500,
      errorMessage,
      'Database Error',
      path,
      {
        code: errorCode,
        details,
        stack,
      }
    );
  }
}