import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from '@kafaat-systems/schemaConfig';
import { RoleType } from '@kafaat-systems/entities';
import { SubdomainService } from '../services/subdomain.service';

export interface SchemaRequest extends Request {
  tenantId?: number;
  schemaName?: string;
  userRole?: RoleType;
}

@Injectable()
export class SubdomainMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SubdomainMiddleware.name);

  constructor(
    private subdomainService: SubdomainService,
    private tenantContextService: TenantContextService
  ) {}

  async use(
    req: SchemaRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check for role override in headers (for testing)
      const roleHeader = req.headers['x-user-role'] as string | undefined;
      const schemaHeader = req.headers['x-schema-name'] as string | undefined;

      if (roleHeader) {
        req.userRole = roleHeader as RoleType;
        this.logger.debug(`Using role from header: ${roleHeader}`);
      }

      if (schemaHeader) {
        req.schemaName = schemaHeader;
        this.logger.debug(`Using schema from header: ${schemaHeader}`);

        // Set the schema in the tenant context
        if (req.schemaName) {
          this.tenantContextService.setSchema(req.schemaName);
        }

        next();
        return;
      }

      // Extract subdomain from host
      const host = req.headers.host || '';
      const hostParts = host.split('.');

      // Check if we have a subdomain
      if (hostParts.length > 2) {
        const subdomain = hostParts[0];

        // Skip for 'www' or 'api' subdomains
        if (subdomain === 'www' || subdomain === 'api') {
          next();
          return;
        }

        // Special case for owner subdomain
        if (subdomain === 'owner') {
          req.userRole = RoleType.OWNER;
          req.schemaName = 'owner';
          this.tenantContextService.setSchema('owner');
          this.logger.debug('Owner subdomain detected, using owner schema');
          next();
          return;
        }

        // Look up tenant by subdomain
        const tenant = await this.subdomainService.getTenantByDomain(subdomain);

        if (tenant) {
          req.tenantId = tenant.id;
          req.schemaName = tenant.schema_name;

          // Default to admin role for tenant subdomains
          if (!req.userRole) {
            req.userRole = RoleType.ADMIN;
          }

          this.tenantContextService.setSchema(tenant.schema_name);
          this.logger.debug(
            `Tenant found for subdomain ${subdomain}, using schema: ${tenant.schema_name}`
          );
        } else {
          this.logger.warn(`No tenant found for subdomain: ${subdomain}`);
        }
      } else {
        // Main domain - default to owner role and public schema
        if (!req.userRole) {
          req.userRole = RoleType.OWNER;
        }

        if (!req.schemaName) {
          req.schemaName = 'public';
          this.tenantContextService.setSchema('public');
        }

        this.logger.debug(
          `Main domain detected, using schema: ${req.schemaName}`
        );
      }

      next();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      this.logger.error(`Error in subdomain middleware: ${message}`);
      // Continue with default schema
      next();
    }
  }
}
