import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SubdomainService } from '../services/subdomain.service';

export interface TenantRequest extends Request {
  tenantId?: number;
  tenantSchema?: string;
}
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private subdomainServics: SubdomainService) {}

  async use(req: TenantRequest, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      // For development/testing, allow a default tenant
      if (process.env.NODE_ENV === 'development' && process.env.DEFAULT_TENANT) {
        req.tenantId = 1;
        req.tenantSchema = process.env.DEFAULT_TENANT;
        next();
        return;
      }

      next();
    } catch (error) {
      // Log error but don't block request in development
      console.error('Error resolving tenant:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return res.status(400).json({ message: 'Invalid tenant', error: errorMessage });
    }
  }
}
