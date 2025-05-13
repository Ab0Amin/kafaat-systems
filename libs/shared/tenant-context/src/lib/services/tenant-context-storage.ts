import { AsyncLocalStorage } from 'async_hooks';
import { RoleType } from '@kafaat-systems/entities';

export interface TenantContext {
  tenantId?: string;
  schema: string;
  role?: RoleType;
}

export const tenantContextStorage = new AsyncLocalStorage<TenantContext>();
