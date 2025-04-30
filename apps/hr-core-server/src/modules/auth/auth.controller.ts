import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SetPasswordDto } from './dto/set-password.dto';
import { Request as ExpressRequest } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('set-password')
  async setPassword(@Body() dto: SetPasswordDto) {
    return this.authService.setPassword(dto);
  }
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
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
