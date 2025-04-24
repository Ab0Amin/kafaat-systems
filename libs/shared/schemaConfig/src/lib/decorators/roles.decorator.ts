import { SetMetadata } from '@nestjs/common';
import { RoleType } from '@kafaat-systems/entities';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);