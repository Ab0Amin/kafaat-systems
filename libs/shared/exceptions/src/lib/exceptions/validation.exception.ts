import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ValidationError } from '@nestjs/common';

export class ValidationException extends BaseException {
  public readonly validationErrors: ValidationError[];

  constructor(
    validationErrors: ValidationError[],
    message = 'Validation Error',
    options?: {
      code?: string;
      details?: Record<string, any>;
    }
  ) {
    super(message, HttpStatus.BAD_REQUEST, {
      code: options?.code || 'VALIDATION_ERROR',
      details: options?.details,
    });
    this.validationErrors = validationErrors;
  }
}