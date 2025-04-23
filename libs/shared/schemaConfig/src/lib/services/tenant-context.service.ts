import { Injectable, Scope, Inject, Optional } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

interface TenantContext {
  tenantId: string;
  schema: string;
}

interface TenantRequest extends Request {
  tenantId?: number;
  tenantSchema?: string;
}

@Injectable({ scope: Scope.DEFAULT })
export class TenantContextService {
  private readonly als = new AsyncLocalStorage<TenantContext>();
  private defaultSchema = process.env.DEFAULT_SCHEMA || 'public';

  constructor(@Optional() @Inject(REQUEST) private request?: TenantRequest) {}

  getContext(): TenantContext | undefined {
    // First try to get from AsyncLocalStorage
    const alsContext = this.als.getStore();
    if (alsContext) {
      return alsContext;
    }

    // If not in ALS, try to get from request
    if (this.request?.tenantId && this.request?.tenantSchema) {
      return {
        tenantId: String(this.request.tenantId),
        schema: this.request.tenantSchema,
      };
    }

    // Return undefined if no context is found
    return undefined;
  }

  getTenantId(): string | undefined {
    return this.getContext()?.tenantId;
  }

  getSchema(): string | undefined {
    // Return the schema from context or default to public
    return this.getContext()?.schema || this.defaultSchema;
  }

  run(context: TenantContext, callback: () => any) {
    return this.als.run(context, callback);
  }

  setDefaultSchema(schema: string): void {
    this.defaultSchema = schema;
  }
}
