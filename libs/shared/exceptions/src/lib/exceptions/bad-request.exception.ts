import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class BadRequestException extends BaseException {
  constructor(
    message = 'Bad Request',
    options?: {
      code?: string;
      details?: Record<string, any>;
    }
  ) {
    super(message, HttpStatus.BAD_REQUEST, {
      code: options?.code || 'BAD_REQUEST',
      details: options?.details,
    });
  }
}