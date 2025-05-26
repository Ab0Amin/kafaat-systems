import { Injectable } from '@nestjs/common';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { getTenantDataSource } from '@kafaat-systems/database';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@kafaat-systems/entities';
import { 
  BadRequestException, 
  ForbiddenException, 
  UnauthorizedException 
} from '@kafaat-systems/exceptions';

@Injectable()
export class ValidateUserUseCase {
  constructor(private readonly tenantContextService: TenantContextService) {}

  async execute(email: string, pass: string): Promise<UserEntity | null> {
    if (!email || !pass) {
      throw new BadRequestException('Invalid email or password', {
        code: 'INVALID_CREDENTIALS',
        details: {
          email: email ? 'provided' : 'missing',
          password: pass ? 'provided' : 'missing'
        }
      });
    }

    const schema = this.tenantContextService.getSchema();

    try {
      const tenantDS = await getTenantDataSource(schema);
      const userRepo = tenantDS.getRepository(UserEntity);

      const user = await userRepo.findOne({ where: { email } });
      if (!user) {
        throw new BadRequestException('User not found', {
          code: 'USER_NOT_FOUND',
          details: {
            email: email
          }
        });
      }

      if (!user.isActive) {
        throw new ForbiddenException('Account is not active', {
          code: 'ACCOUNT_INACTIVE',
          details: {
            userId: user.id,
            email: user.email
          }
        });
      }
      
      const validatePassword = await bcrypt.compare(pass, user.passwordHash);
      if (!validatePassword) {
        throw new UnauthorizedException('Invalid password', {
          code: 'INVALID_PASSWORD',
          details: {
            userId: user.id,
            email: user.email
          }
        });
      }
    } catch (error) {
      // Re-throw custom exceptions, wrap others in BadRequestException
      if (error instanceof BadRequestException || 
          error instanceof ForbiddenException || 
          error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new BadRequestException('Authentication failed', {
        code: 'AUTH_ERROR',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          schema: schema
        }
      });
    }
    return user;
  }
}
