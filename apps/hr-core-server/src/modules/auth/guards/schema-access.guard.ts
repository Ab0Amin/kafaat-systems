import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
  Scope,
} from '@nestjs/common';
import { RoleType } from '@kafaat-systems/entities';
import { Reflector } from '@nestjs/core';
import { TenantContextService } from '../../tenant/services/tenant-context.service';

@Injectable({ scope: Scope.REQUEST })
export class SchemaAccessGuard implements CanActivate {
  private readonly logger = new Logger(SchemaAccessGuard.name);

  constructor(
    private tenantContextService: TenantContextService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Skip access control in development mode if configured
    Logger.log('SchemaAccessGuard constructed');
    Logger.log(this.tenantContextService);
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.SKIP_SCHEMA_ACCESS_CONTROL === 'true'
    ) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    Logger.log('ssssssssssssssss');
    Logger.log(this.tenantContextService);

    const userRole = this.tenantContextService.getRole();
    Logger.log('ggfgggggggggg');
    const schema = this.tenantContextService.getSchema();

    // Get required roles from metadata (if any)
    const requiredRoles =
      this.reflector.get<RoleType[]>('roles', context.getHandler()) || [];

    // Check if the user has the required role
    if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
      this.logger.warn(
        `Access denied: User with role ${userRole} does not have required roles ${requiredRoles.join(
          ', '
        )}`
      );
      throw new ForbiddenException(
        'You do not have the required role to access this resource'
      );
    }

    // Owner role can access any schema
    if (userRole === RoleType.OWNER) {
      return true;
    }

    // Admin role can only access their assigned schema
    if (userRole === RoleType.ADMIN) {
      const requestedSchema = request.params.schema || schema;

      if (
        requestedSchema &&
        requestedSchema !== schema &&
        requestedSchema !== 'public'
      ) {
        this.logger.warn(
          `Access denied: Admin of schema ${schema} tried to access schema ${requestedSchema}`
        );
        throw new ForbiddenException(
          `You do not have access to schema ${requestedSchema}`
        );
      }
    }

    return true;
  }
}
