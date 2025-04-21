import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../services/tenant.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant identifier from request (subdomain, header, etc.)
    const host = req.headers.host || '';
    const domain = host.split(':')[0]; // Remove port if present
    
    try {
      // Get tenant info and set in request
      const tenant = await this.tenantService.getTenantByDomain(domain);
      if (tenant) {
        (req as any).tenantId = tenant.id;
        (req as any).tenantSchema = tenant.schema_name;
      }
    } catch (error) {
      // Log error but don't block request
      console.error('Error resolving tenant:', error);
    }
    
    next();
  }
}