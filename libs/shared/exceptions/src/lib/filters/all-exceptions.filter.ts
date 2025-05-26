import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
  ValidationError,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { BaseException } from '../exceptions/base.exception';
import { ValidationException } from '../exceptions/validation.exception';
import { DatabaseException } from '../exceptions/database.exception';
import { ErrorFormatter } from '../utils/error-formatter.util';
import { ExceptionsModuleOptions } from '../exceptions.module';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    @Inject('EXCEPTIONS_MODULE_OPTIONS')
    private readonly options: ExceptionsModuleOptions
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.url;

    // Log the exception
    if (this.options.logErrors) {
      this.logException(exception, request);
    }

    // Handle different types of exceptions
    if (exception instanceof ValidationException) {
      return this.handleValidationException(exception, response, path);
    } else if (exception instanceof BaseException) {
      return this.handleBaseException(exception, response, path);
    } else if (exception instanceof HttpException) {
      return this.handleHttpException(exception, response, path);
    } else if (exception instanceof QueryFailedError) {
      return this.handleDatabaseException(exception, response, path);
    } else {
      return this.handleUnknownException(exception, response, path);
    }
  }

  private handleValidationException(
    exception: ValidationException,
    response: Response,
    path: string
  ) {
    const status = exception.getStatus();
    const errorResponse = ErrorFormatter.formatValidationError(
      status,
      exception.message,
      'Validation Error',
      path,
      exception.validationErrors,
      this.options.logStackTrace ? exception.stack : undefined
    );

    return response.status(status).json(errorResponse);
  }

  private handleBaseException(
    exception: BaseException,
    response: Response,
    path: string
  ) {
    const status = exception.getStatus();
    const errorResponse = ErrorFormatter.formatError(
      status,
      exception.message,
      exception.name,
      path,
      {
        code: exception.code,
        details: exception.details,
        stack: this.options.logStackTrace ? exception.stack : undefined,
      }
    );

    return response.status(status).json(errorResponse);
  }

  private handleHttpException(
    exception: HttpException,
    response: Response,
    path: string
  ) {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    let message: string | string[] = exception.message;
    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      message = (exceptionResponse as any).message;
    }

    const errorResponse = ErrorFormatter.formatError(
      status,
      message,
      exception.name,
      path,
      {
        stack: this.options.logStackTrace ? exception.stack : undefined,
      }
    );

    return response.status(status).json(errorResponse);
  }

  private handleDatabaseException(
    exception: QueryFailedError,
    response: Response,
    path: string
  ) {
    const dbException = new DatabaseException(
      'Database operation failed',
      {
        originalError: exception,
        details: {
          query: exception.query,
          parameters: exception.parameters,
        },
      }
    );

    const errorResponse = ErrorFormatter.formatDatabaseError(
      dbException.message,
      path,
      exception,
      this.options.logStackTrace ? exception.stack : undefined
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }

  private handleUnknownException(
    exception: any,
    response: Response,
    path: string
  ) {
    const errorMessage = exception instanceof Error 
      ? exception.message 
      : 'Internal server error';
    
    const errorResponse = ErrorFormatter.formatError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage,
      'Internal Server Error',
      path,
      {
        stack: this.options.logStackTrace ? (exception instanceof Error ? exception.stack : undefined) : undefined,
      }
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }

  private logException(exception: unknown, request: Request) {
    const method = request.method;
    const url = request.url;
    const userAgent = request.headers['user-agent'] || 'unknown';
    const ip = request.ip || 'unknown';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const isServerError = status >= 500;
      
      if (isServerError) {
        this.logger.error(
          `[${method}] ${url} - ${status} - ${exception.message}`,
          this.options.logStackTrace ? exception.stack : undefined,
          `IP: ${ip}, User-Agent: ${userAgent}`
        );
      } else {
        this.logger.warn(
          `[${method}] ${url} - ${status} - ${exception.message}`,
          `IP: ${ip}, User-Agent: ${userAgent}`
        );
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `[${method}] ${url} - 500 - ${exception.message}`,
        this.options.logStackTrace ? exception.stack : undefined,
        `IP: ${ip}, User-Agent: ${userAgent}`
      );
    } else {
      this.logger.error(
        `[${method}] ${url} - 500 - Unknown error`,
        exception,
        `IP: ${ip}, User-Agent: ${userAgent}`
      );
    }
  }
}