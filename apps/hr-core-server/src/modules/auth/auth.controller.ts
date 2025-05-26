import { Controller, Post, Body, Request, Put } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import {
  LoginUseCase,
  Public,
  RefreshTokenUseCase,
  ResetPasswordUseCase,
  SetPasswordUseCase,
  ValidateMobileUserUseCase,
  ValidateUserUseCase,
} from '@kafaat-systems/core-app';
import base64 = require('base-64');
import { LoginDto } from './dto/login.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { ApiTags } from '@nestjs/swagger';
interface AuthenticatedRequest extends ExpressRequest {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('authintication')
@Controller('authintication')
export class AuthController {
  constructor(
    private readonly SetPasswordUseCase: SetPasswordUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly validateMobileUserUseCase: ValidateMobileUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  @Public()
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

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() token: string) {
    return this.refreshTokenUseCase.execute(token);
  }

  @Public()
  @Put('set-password')
  async setPassword(@Body() dto: SetPasswordDto) {
    return this.SetPasswordUseCase.execute(dto);
  }

  @Public()
  @Put('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(dto);
  }

  @Public()
  @Post('register-device')
  async registerDevice(
    @Request() req: AuthenticatedRequest,
    @Body()
    dto: RegisterDeviceDto
  ) {
    return this.validateMobileUserUseCase.execute(req.user.userId, dto);
  }
}
