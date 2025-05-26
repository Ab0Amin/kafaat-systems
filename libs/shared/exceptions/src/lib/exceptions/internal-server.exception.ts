import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class InternalServerException extends BaseException {
  constructor(
    message = 'Internal Server Error',
    options?: {
      code?: string;
      details?: Record<string, any>;
    }
  ) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, {
      code: options?.code || 'INTERNAL_SERVER_ERROR',
      details: options?.details,
    });
  }
}