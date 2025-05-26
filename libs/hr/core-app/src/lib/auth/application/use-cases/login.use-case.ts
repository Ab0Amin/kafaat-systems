import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@kafaat-systems/entities';
import { jwtConstants } from '../../infrastructure/security/strategies/jwt.constants.strategy';
import { SharedLoginResponseDto } from '../../interfaces/dtos/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(user: UserEntity): Promise<SharedLoginResponseDto> {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: jwtConstants.refreshIn,
      }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subdomain: user.schemaName,
      },
    };
  }
}
