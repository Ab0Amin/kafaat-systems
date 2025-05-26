import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor(
    message = 'Unauthorized',
    options?: {
      code?: string;
      details?: Record<string, any>;
    }
  ) {
    super(message, HttpStatus.UNAUTHORIZED, {
      code: options?.code || 'UNAUTHORIZED',
      details: options?.details,
    });
  }
}