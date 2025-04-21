import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

interface TenantContext {
  tenantId: string;
  schema: string;
}

@Injectable({ scope: Scope.DEFAULT })
export class TenantContextService {
  private readonly als = new AsyncLocalStorage<TenantContext>();

  getContext(): TenantContext | undefined {
    return this.als.getStore();
  }

  getTenantId(): string | undefined {
    return this.getContext()?.tenantId;
  }

  getSchema(): string | undefined {
    return this.getContext()?.schema;
  }

  run(context: TenantContext, callback: () => any) {
    return this.als.run(context, callback);
  }
}