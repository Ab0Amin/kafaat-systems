import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  public readonly code: string;
  public readonly details?: Record<string, any>;
  public readonly timestamp: string;

  constructor(
    message: string,
    status: HttpStatus,
    options?: {
      code?: string;
      details?: Record<string, any>;
    }
  ) {
    super(message, status);
    this.code = options?.code || this.constructor.name;
    this.details = options?.details;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}