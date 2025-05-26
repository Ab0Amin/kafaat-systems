import { Injectable } from '@nestjs/common';
import { TokenService } from '../../infrastructure/service/temp-token.service';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { UserEntity } from '@kafaat-systems/entities';
import { getTenantDataSource } from '@kafaat-systems/database';
import * as bcrypt from 'bcrypt';
import { SharedSetPasswordDto } from '../../interfaces/dtos/set-password.dto';
import {
  BadRequestException,
  NotFoundException,
  InternalServerException,
} from '@kafaat-systems/exceptions';

@Injectable()
export class SetPasswordUseCase {
  constructor(
    private readonly tenantContextService: TenantContextService,
    private readonly tokenService: TokenService
  ) {}

  async execute(dto: SharedSetPasswordDto): Promise<{ message: string }> {
    if (dto.password && dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match', {
        code: 'PASSWORDS_MISMATCH',
        details: { providedFields: ['password', 'confirmPassword'] },
      });
    }

    try {
      const schema = this.tenantContextService.getSchema();
      const tenantDS = await getTenantDataSource(schema);

      const resetToken = await this.tokenService.validateToken(dto.token, tenantDS);
      if (!resetToken) {
        throw new BadRequestException('Invalid or expired token', {
          code: 'INVALID_TOKEN',
          details: { token: dto.token },
        });
      }

      const userRepo = tenantDS.getRepository(UserEntity);

      const admin = await userRepo.findOne({
        where: { id: resetToken.adminId },
      });

      if (!admin) {
        throw new NotFoundException('Admin not found', {
          code: 'ADMIN_NOT_FOUND',
          details: { adminId: resetToken.adminId },
        });
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      admin.passwordHash = passwordHash;
      admin.isActive = true;

      await userRepo.save(admin);
      await this.tokenService.deleteToken(dto.token, tenantDS);

      return { message: 'Password set successfully' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof InternalServerException
      ) {
        throw error;
      }

      throw new InternalServerException('Failed to set password', {
        code: 'SET_PASSWORD_FAILED',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          token: dto.token,
        },
      });
    }
  }
}
