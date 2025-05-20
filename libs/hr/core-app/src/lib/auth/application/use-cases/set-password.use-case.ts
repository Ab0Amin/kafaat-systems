import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenService } from '../../infrastructure/service/temp-token.service';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { UserEntity } from '@kafaat-systems/entities';
import { getTenantDataSource } from '@kafaat-systems/database';
import * as bcrypt from 'bcrypt';
import { SetPasswordDto } from '../dtos/set-password.dto';
@Injectable()
export class SetPasswordUseCase {
  constructor(
    private readonly tenantContextService: TenantContextService,

    private readonly tokenService: TokenService
  ) {}

  async execute(dto: SetPasswordDto): Promise<{ message: string }> {
    if (dto.password && dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    try {
      const schema = this.tenantContextService.getSchema();
      const tenantDS = await getTenantDataSource(schema);

      const resetToken = await this.tokenService.validateToken(dto.token, tenantDS);

      if (!resetToken) {
        throw new BadRequestException('Invalid or expired token');
      }

      const userRepo = tenantDS.getRepository(UserEntity);

      const admin = await userRepo.findOne({
        where: { id: resetToken.adminId },
      });

      if (!admin) {
        throw new BadRequestException('Admin not found');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      admin.passwordHash = passwordHash;
      admin.isActive = true;

      await userRepo.save(admin);
      await this.tokenService.deleteToken(dto.token, tenantDS);

      return { message: 'Password set successfully' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException('Something went wrong', error.message);
      }
      throw new BadRequestException('Something went wrong');
    }
  }
}
