import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class TenantException extends BaseException {
  constructor(
    message = 'Tenant Error',
    options?: {
      code?: string;
      details?: Record<string, any>;
    }
  ) {
    super(message, HttpStatus.BAD_REQUEST, {
      code: options?.code || 'TENANT_ERROR',
      details: options?.details,
    });
  }
}

export class TenantNotFoundException extends TenantException {
  constructor(
    message = 'Tenant not found',
    options?: {
      code?: string;
      details?: Record<string, any>;
    }
  ) {
    super(message, {
      code: options?.code || 'TENANT_NOT_FOUND',
      details: options?.details,
    });
  }
}

export class TenantInactiveException extends TenantException {
  constructor(
    message = 'Tenant is inactive',
    options?: {
      code?: string;
      details?: Record<string, any>;
    }
  ) {
    super(message, {
      code: options?.code || 'TENANT_INACTIVE',
      details: options?.details,
    });
  }
}

export class TenantAccessDeniedException extends TenantException {
  constructor(
    message = 'Access to tenant denied',
    options?: {
      code?: string;
      details?: Record<string, any>;
    }
  ) {
    super(message, {
      code: options?.code || 'TENANT_ACCESS_DENIED',
      details: options?.details,
    });
  }
}