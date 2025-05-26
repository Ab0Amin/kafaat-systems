import { BadRequestException, Injectable } from '@nestjs/common';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { UserEntity } from '@kafaat-systems/entities';
import { getTenantDataSource } from '@kafaat-systems/database';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../infrastructure/security/strategies/jwt.constants.strategy';
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly tenantContextService: TenantContextService,
    private readonly jwtService: JwtService
  ) {}

  async execute(token: string) {
    if (!token) {
      throw new BadRequestException('Refresh token is required');
    }
    try {
      const decoded = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });

      const schema = this.tenantContextService.getSchema();

      const tenantDS = await getTenantDataSource(schema);

      const userRepo = tenantDS.getRepository(UserEntity);

      const user = await userRepo.findOne({ where: { id: decoded.sub } });
      if (!user) throw new BadRequestException('error in refresh token');

      return true;
    } catch (error: unknown) {
      throw new BadRequestException(
        'something went wrong in refresh token: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }
}
