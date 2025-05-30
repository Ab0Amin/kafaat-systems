import { Injectable, Scope, Inject, Optional, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RoleType } from '@kafaat-systems/entities';
import { tenantContextStorage } from './tenant-context-storage';

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

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  // private readonly als = new AsyncLocalStorage<TenantContext>();
  private readonly logger = new Logger(TenantContextService.name);
  private currentSchema: string = process.env.DEFAULT_SCHEMA || 'public';
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
    return tenantContextStorage.getStore();
  }

  // getContext(): TenantContext | undefined {
  //   // First try to get from AsyncLocalStorage
  //   const alsContext = this.als.getStore();

  //   if (alsContext) {
  //     return alsContext;
  //   }

  //   // If not in ALS, try to get from request
  //   console.log('Request schemaName:', this.request?.schemaName);
  //   if (this.request?.schemaName) {
  //     return {
  //       tenantId: this.request.tenantId ? String(this.request.tenantId) : undefined,
  //       schema: this.request.schemaName,
  //       role: this.request.userRole,
  //     };
  //   }

  //   // Return default context as fallback
  //   return {
  //     schema: this.currentSchema,
  //     role: this.currentRole,
  //   };
  // }

  getTenantId(): string | undefined {
    return this.getContext()?.tenantId;
  }

  getSchema(): string {
    // Return the schema from context or current schema or default
    return this.getContext()?.schema || this.currentSchema;
  }

  getRole(): RoleType {
    // Return the role from context or current role or default
    return this.getContext()?.role || this.currentRole;
  }

  isOwner(): boolean {
    return this.getRole() === RoleType.OWNER;
  }

  isAdmin(): boolean {
    return this.getRole() === RoleType.ADMIN || this.isOwner();
  }

  setSchema(schema: string): void {
    this.logger.debug(`Setting schema to: ${schema}`);
    this.currentSchema = schema;
  }

  setRole(role: RoleType): void {
    this.logger.debug(`Setting role to: ${role}`);
    this.currentRole = role;
  }

  setcurrentSchema(schema: string): void {
    this.currentSchema = schema;
  }
}
