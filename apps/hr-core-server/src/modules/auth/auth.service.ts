import { Injectable, BadRequestException } from '@nestjs/common';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { createTenantDataSource } from '@kafaat-systems/database';
import { TokenService } from './service/temp-token.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@kafaat-systems/entities';
import { SetPasswordDto } from './dto/set-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tenantContextService: TenantContextService,
    private readonly tokenService: TokenService
  ) {}

  async setPassword(dto: SetPasswordDto) {
    const schema = this.tenantContextService.getSchema();
    const tenantDS = createTenantDataSource(schema);

    if (!tenantDS.isInitialized) {
      await tenantDS.initialize();
    }

    const resetToken = await this.tokenService.validateToken(
      dto.token,
      tenantDS
    );
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

    await userRepo.save(admin);
    await this.tokenService.deleteToken(dto.token, tenantDS);

    return { message: 'Password set successfully' };
  }
}
