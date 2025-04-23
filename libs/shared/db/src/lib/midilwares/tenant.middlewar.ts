import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '@kafaat-systems/tenant';

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
      const headerTenant = req.headers['x-tenant-id'] as string | undefined;

      // Extract tenant identifier from request (subdomain, header, etc.)
      const host = req.headers.host || '';
      const domain = host.split(':')[0]; // Remove port if present
      const tenantIdentifier = headerTenant || domain;
      // Get tenant info and set in request
      const tenant = await this.tenantService.getTenantByDomain(
        tenantIdentifier
      );
      if (!tenant) {
        throw new UnauthorizedException(
          `Tenant not found for identifier: ${tenantIdentifier}`
        );
      }
      req.tenantId = tenant.id;
      req.tenantSchema = tenant.schema_name;
    } catch (error) {
      // Log error but don't block request
      console.error('Error resolving tenant:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return res
        .status(400)
        .json({ message: 'Invalid tenant', error: errorMessage });
    }

    next();
  }
}
