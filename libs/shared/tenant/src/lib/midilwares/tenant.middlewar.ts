import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../tenant.service';

export interface TenantRequest extends Request {
  tenantId?: number;
  tenantSchema?: string;
}
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantService: TenantService) {}

  async use(
    req: TenantRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      // For development/testing, allow a default tenant
      if (process.env.NODE_ENV === 'development' && process.env.DEFAULT_TENANT) {
        req.tenantId = 1;
        req.tenantSchema = process.env.DEFAULT_TENANT;
        next();
        return;
      }
      
      const headerTenant = req.headers['x-tenant-id'] as string | undefined;

      // Extract tenant identifier from request (subdomain, header, etc.)
      const host = req.headers.host || '';
      const domain = host.split(':')[0]; // Remove port if present
      const tenantIdentifier = headerTenant || domain;
      
      // Skip tenant resolution for public routes if needed
      const path = req.path;
      if (path.startsWith('/api/public') || path.startsWith('/api/tenant/register')) {
        next();
        return;
      }
      
      // Get tenant info and set in request
      const tenant = await this.tenantService.getTenantByDomain(
        tenantIdentifier
      );
      
      if (!tenant) {
        console.warn(`Tenant not found for identifier: ${tenantIdentifier}`);
        // For development, continue without tenant context
        if (process.env.NODE_ENV === 'development') {
          next();
          return;
        }
        
        return res
          .status(400)
          .json({ 
            message: 'Invalid tenant', 
            error: `Tenant not found for identifier: ${tenantIdentifier}` 
          });
      }
      
      req.tenantId = tenant.id;
      req.tenantSchema = tenant.schema_name;
      next();
    } catch (error) {
      // Log error but don't block request in development
      console.error('Error resolving tenant:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
        
      if (process.env.NODE_ENV === 'development') {
        next();
        return;
      }
      
      return res
        .status(400)
        .json({ message: 'Invalid tenant', error: errorMessage });
    }
  }
}
