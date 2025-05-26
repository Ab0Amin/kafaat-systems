import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(
    message = 'Not Found',
    options?: {
      code?: string;
      details?: Record<string, any>;
    }
  ) {
    super(message, HttpStatus.NOT_FOUND, {
      code: options?.code || 'NOT_FOUND',
      details: options?.details,
    });
  }
}