import { Body, Controller, Post, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { SetPasswordUseCase } from '../../application/use-cases/set-password.use-case';
import { SetPasswordDto } from '../dtos/set-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password.use-case';
import { LoginDto } from '../dtos/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { ValidateUserUseCase } from '../../application/use-cases/validate-user.use-case';
import { ValidateMobileUserUseCase } from '../../application/use-cases/validate-mobile-use-case';
import * as base64 from 'base-64';

@Controller('auth2')
export class AuthController {
  constructor(
    private readonly SetPasswordUseCase: SetPasswordUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly validateMobileUserUseCase: ValidateMobileUserUseCase
  ) {}
  @Post('login')
  async login(@Request() req: ExpressRequest, @Body() loginDto: LoginDto) {
    const user = await this.validateUserUseCase.execute(loginDto.email, loginDto.password);
    if (!user) throw new Error('Invalid credentials');
    if (req?.headers['x-device-info']) {
      const raw = String(req.headers['x-device-info']);
      const json = JSON.parse(base64.decode(raw)) || {};
      await this.validateMobileUserUseCase.execute(user.id, json);
    }
    return this.loginUseCase.execute(user);
  }

  @Post('set-password')
  async setPassword(@Body() dto: SetPasswordDto) {
    return this.SetPasswordUseCase.execute(dto);
  }
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(dto);
  }
}
