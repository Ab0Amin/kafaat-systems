import { Injectable, BadRequestException } from '@nestjs/common';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { createTenantDataSource } from '@kafaat-systems/database';
import { TokenService } from './service/temp-token.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@kafaat-systems/entities';
import { SetPasswordDto } from './dto/set-password.dto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtConstants } from './strategies/jwt.constants.strategy';
@Injectable()
export class AuthService {
  constructor(
    private readonly tenantContextService: TenantContextService,
    private readonly tokenService: TokenService,
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {}

  async setPassword(dto: SetPasswordDto) {
    const schema = this.tenantContextService.getSchema();
    const tenantDS = createTenantDataSource(schema);

    if (!tenantDS.isInitialized) {
      await tenantDS.initialize();
    }

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
    admin.isActive = true; // Activate the user if needed

    await userRepo.save(admin);
    await this.tokenService.deleteToken(dto.token, tenantDS);

    return { message: 'Password set successfully' };
  }

  async validateUser(email: string, pass: string): Promise<UserEntity | null> {
    if (!email || !pass) {
      throw new BadRequestException('Invalid email or password');
    }

    const schema = this.tenantContextService.getSchema();

    const tenantDS = createTenantDataSource(schema);

    if (!tenantDS.isInitialized) {
      await tenantDS.initialize();
    }
    const userRepo = tenantDS.getRepository(UserEntity);

    const user = await userRepo.findOne({ where: { email } });
    tenantDS.destroy(); // Close the connection after use
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async login(user: UserEntity) {
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: jwtConstants.refreshIn,
      }),
    };
  }

  async refresh(token: string) {
    if (!token) {
      throw new BadRequestException('Refresh token is required');
    }
    try {
      const decoded = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });

      const schema = this.tenantContextService.getSchema();

      const tenantDS = createTenantDataSource(schema);

      if (!tenantDS.isInitialized) {
        await tenantDS.initialize();
      }
      const userRepo = tenantDS.getRepository(UserEntity);

      const user = await userRepo.findOne({ where: { id: decoded.sub } });
      tenantDS.destroy();
      if (!user) throw new BadRequestException('error in refresh token');

      return this.login(user);
    } catch (error: unknown) {
      throw new BadRequestException(
        'something went wrong in refresh token: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }
}
