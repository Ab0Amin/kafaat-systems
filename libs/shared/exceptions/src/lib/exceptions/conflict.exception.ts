import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ConflictException extends BaseException {
  constructor(
    message = 'Conflict',
    options?: {
      code?: string;
      details?: Record<string, any>;
    }
  ) {
    super(message, HttpStatus.CONFLICT, {
      code: options?.code || 'CONFLICT',
      details: options?.details,
    });
  }
}