import { Injectable } from '@nestjs/common';
import { TokenService } from '../../infrastructure/service/temp-token.service';
import { TenantContextService } from '@kafaat-systems/tenant-context';

@Injectable()
export class SetPasswordUseCase {
  constructor(
    private readonly tenantContextService: TenantContextService,
    private readonly tokenService: TokenService
  ) {}

  async execute(dto: SetPasswordDto) {}
}
