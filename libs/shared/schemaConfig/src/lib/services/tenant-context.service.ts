import { Injectable, Scope, Inject, Optional, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RoleType } from '@kafaat-systems/entities';

interface TenantContext {
  tenantId?: string;
  schema: string;
  role?: RoleType;
}

interface SchemaRequest extends Request {
  tenantId?: number;
  schemaName?: string;
  userRole?: RoleType;
}

@Injectable({ scope: Scope.DEFAULT })
export class TenantContextService {
  private readonly als = new AsyncLocalStorage<TenantContext>();
  private defaultSchema = process.env.DEFAULT_SCHEMA || 'public';
  private readonly logger = new Logger(TenantContextService.name);
  private currentSchema: string = this.defaultSchema;
  private currentRole: RoleType = RoleType.USER;

  constructor(@Optional() @Inject(REQUEST) private request?: SchemaRequest) {
    // Initialize from request if available
    if (this.request?.schemaName) {
      this.currentSchema = this.request.schemaName;
    }
    
    if (this.request?.userRole) {
      this.currentRole = this.request.userRole;
    }
  }

  getContext(): TenantContext | undefined {
    // First try to get from AsyncLocalStorage
    const alsContext = this.als.getStore();
    if (alsContext) {
      return alsContext;
    }

    // If not in ALS, try to get from request
    if (this.request?.schemaName) {
      return {
        tenantId: this.request.tenantId ? String(this.request.tenantId) : undefined,
        schema: this.request.schemaName,
        role: this.request.userRole,
      };
    }

    // Return current context if we have one
    if (this.currentSchema) {
      return {
        schema: this.currentSchema,
        role: this.currentRole,
      };
    }

    // Return default context as fallback
    return {
      schema: this.defaultSchema,
      role: RoleType.USER,
    };
  }

  getTenantId(): string | undefined {
    return this.getContext()?.tenantId;
  }

  getSchema(): string {
    // Return the schema from context or current schema or default
    return this.getContext()?.schema || this.currentSchema || this.defaultSchema;
  }

  getRole(): RoleType {
    // Return the role from context or current role or default
    return this.getContext()?.role || this.currentRole || RoleType.USER;
  }

  isOwner(): boolean {
    return this.getRole() === RoleType.OWNER;
  }

  isAdmin(): boolean {
    return this.getRole() === RoleType.ADMIN || this.isOwner();
  }

  run(context: TenantContext, callback: () => any) {
    return this.als.run(context, callback);
  }

  setSchema(schema: string): void {
    this.logger.debug(`Setting schema to: ${schema}`);
    this.currentSchema = schema;
  }

  setRole(role: RoleType): void {
    this.logger.debug(`Setting role to: ${role}`);
    this.currentRole = role;
  }

  setDefaultSchema(schema: string): void {
    this.defaultSchema = schema;
  }
}
