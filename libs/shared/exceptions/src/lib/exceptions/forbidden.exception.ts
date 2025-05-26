import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ForbiddenException extends BaseException {
  constructor(
    message = 'Forbidden',
    options?: {
      code?: string;
      details?: Record<string, any>;
    }
  ) {
    super(message, HttpStatus.FORBIDDEN, {
      code: options?.code || 'FORBIDDEN',
      details: options?.details,
    });
  }
}