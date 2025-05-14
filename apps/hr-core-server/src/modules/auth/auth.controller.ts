import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SetPasswordDto } from './dto/set-password.dto';
import { Request as ExpressRequest } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RegisterDeviceDto } from './dto/register-device.dto';
interface AuthenticatedRequest extends ExpressRequest {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('set-password')
  async setPassword(@Body() dto: SetPasswordDto) {
    return this.authService.setPassword(dto);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Public()
  @Post('register-device')
  async registerDevice(@Request() req: AuthenticatedRequest, @Body() dto: RegisterDeviceDto) {
    return this.authService.registeredDevice(req.user.userId, dto);
  }

  @Post('validate-reset-token')
  @Public()
  async validateResetToken(@Body('token') token: string) {
    return this.authService.validateToken(token);
  }
  @Public()
  @Post('login')
  async login(@Request() req: ExpressRequest, @Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password, req);
    if (!user) throw new Error('Invalid credentials');
    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body() loginResponseDto: LoginResponseDto) {
    return this.authService.refresh(loginResponseDto.refreshToken);
  }

  @Post('protected')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
}
