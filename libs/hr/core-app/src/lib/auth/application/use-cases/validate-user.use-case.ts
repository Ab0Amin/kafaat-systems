import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { getTenantDataSource } from '@kafaat-systems/database';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@kafaat-systems/entities';

@Injectable()
export class ValidateUserUseCase {
  constructor(private readonly tenantContextService: TenantContextService) {}

  async execute(email: string, pass: string): Promise<UserEntity | null> {
    if (!email || !pass) {
      throw new BadRequestException('Invalid email or password');
    }

    const schema = this.tenantContextService.getSchema();

    const tenantDS = await getTenantDataSource(schema);
    const userRepo = tenantDS.getRepository(UserEntity);

    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account is not active');
    }
    const validatePassword = await bcrypt.compare(pass, user.passwordHash);
    if (!validatePassword) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }
}
