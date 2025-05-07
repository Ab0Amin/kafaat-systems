import { Injectable, NestMiddleware, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RoleType } from '@kafaat-systems/entities';
import { SubdomainService } from '../services/subdomain.service';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { parse } from 'tldts';
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

  async use(req: SchemaRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check for role override in headers (for testing)
      const roleHeader = req.headers['x-user-role'] as string | undefined;
      const schemaHeader = req.headers['x-schema-name'] as string | undefined;

      if (roleHeader) {
        req.userRole = roleHeader as RoleType;
        if (roleHeader === 'owner') {
          this.logger.debug(`Using role from header: ${roleHeader}`);
          next();
          return;
        }

        this.logger.debug(`Using role from header1: ${roleHeader}`);
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
      const parsedHost = parse(host);

      // Remove localhost from host if present
      const mainHost: string = '.' + process.env.BE_HOST || '';
      let subdomain: string = parsedHost.hostname?.replace(mainHost, '') || '';
      if (subdomain?.includes('www.') || subdomain?.includes('api.')) {
        subdomain = subdomain?.replace('www.', '').replace('api.', '');
      }
      // Check if we have a subdomain
      if (subdomain) {
        if (subdomain === 'owner') {
          req.schemaName = 'owner';
          req.userRole = RoleType.OWNER;
          this.tenantContextService.setSchema('owner');
          this.tenantContextService.setRole(RoleType.OWNER);
          this.logger.debug('Using owner schema');
          next();
          return;
        } else {
          // Look up tenant by subdomain

          const tenant = await this.subdomainService.getTenantByDomain(subdomain);

          if (tenant) {
            req.tenantId = tenant.id;
            req.schemaName = tenant.schema_name;

            this.tenantContextService.setSchema(tenant.schema_name);
            this.logger.debug(
              `Tenant found for subdomain ${subdomain}, using schema: ${tenant.schema_name}`
            );
          } else {
            throw new HttpException('Tenant does not exist', HttpStatus.BAD_REQUEST);
          }
        }
      } else {
        throw new HttpException('Tenant does not exist', HttpStatus.BAD_REQUEST);
      }

      next();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      this.logger.error(`Error in subdomain middleware: ${message}`);
      // Continue with default schema
      next(error);
    }
  }
}
