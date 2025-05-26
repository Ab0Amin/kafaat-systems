import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RoleType } from '@kafaat-systems/entities';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { parse } from 'tldts';
import { tenantContextStorage } from '@kafaat-systems/tenant-context';
import { GetTenantByDomainUseCase } from '../../application/use-cases/get-tenant-by-domain.use-case';
import { 
  TenantNotFoundException, 
  TenantInactiveException 
} from '@kafaat-systems/exceptions';
export interface SchemaRequest extends Request {
  tenantId?: number;
  schemaName?: string;
  userRole?: RoleType;
}

@Injectable()
export class SubdomainMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SubdomainMiddleware.name);

  constructor(
    private getTenantByDomainUseCase: GetTenantByDomainUseCase,
    private tenantContextService: TenantContextService
  ) {}

  async use(req: SchemaRequest, res: Response, next: NextFunction): Promise<void> {
    try {
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
          const context = {
            schema: 'owner',
            role: RoleType.OWNER,
            tenantId: undefined,
          };

          tenantContextStorage.run(context, () => {
            this.tenantContextService.setSchema('owner');
            this.tenantContextService.setRole(RoleType.OWNER);
            this.logger.debug('Using owner schema');
            next();
          });

          return;
        } else {
          // Look up tenant by subdomain

          let tenant = await this.getTenantByDomainUseCase.execute(subdomain);
          // only login can check subdomain from email
          if (!tenant && req.baseUrl.includes('login') && req.body.email) {
            const email: string = req.body.email;
            const domain = email.split('@')[1]?.split('.')[0];
            tenant = await this.getTenantByDomainUseCase.execute(domain);
          }
          if (tenant) {
            if (!tenant?.isActive) {
              throw new TenantInactiveException('Tenant is deactivated, please contact support', {
                details: {
                  tenantId: tenant.id,
                  domain: subdomain
                }
              });
            }
            const context = {
              schema: tenant.schema_name,
              role: RoleType.USER,
              tenantId: String(tenant.id),
            };
            req.tenantId = parseInt(tenant.id);
            req.schemaName = tenant.schema_name;

            tenantContextStorage.run(context, () => {
              this.tenantContextService.setSchema(context.schema);
              this.tenantContextService.setRole(context.role);
              this.logger.debug(
                `Tenant found for subdomain ${subdomain}, using schema: ${tenant.schema_name}`
              );
              next();
            });
          } else {
            throw new TenantNotFoundException(`Tenant with domain '${subdomain}' does not exist`, {
              details: {
                requestedDomain: subdomain
              }
            });
          }
        }
      } else {
        throw new TenantNotFoundException('No tenant subdomain provided', {
          details: {
            host: host
          }
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      this.logger.error(`Error in subdomain middleware: ${message}`);
      next(error);
    }
  }
}
