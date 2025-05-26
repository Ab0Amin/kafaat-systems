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
import { 
  UnauthorizedException, 
  BadRequestException 
} from '@kafaat-systems/exceptions';
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
    try {
      const user = await this.validateUserUseCase.execute(loginDto.email, loginDto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials', {
          code: 'INVALID_CREDENTIALS',
          details: {
            email: loginDto.email
          }
        });
      }
      
      if (req?.headers['x-device-info']) {
        try {
          const raw = String(req.headers['x-device-info']);
          const json = JSON.parse(base64.decode(raw)) || {};
          await this.validateMobileUserUseCase.execute(user.id, json);
        } catch (error) {
          throw new BadRequestException('Invalid device info format', {
            code: 'INVALID_DEVICE_INFO',
            details: {
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          });
        }
      }
      
      return this.loginUseCase.execute(user);
    } catch (error) {
      // Re-throw custom exceptions, wrap others
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed', {
        code: 'AUTH_FAILED',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() token: string) {
    try {
      return await this.refreshTokenUseCase.execute(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token', {
        code: 'INVALID_REFRESH_TOKEN',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  @Public()
  @Put('set-password')
  async setPassword(@Body() dto: SetPasswordDto) {
    try {
      return await this.SetPasswordUseCase.execute(dto);
    } catch (error) {
      throw new BadRequestException('Failed to set password', {
        code: 'SET_PASSWORD_FAILED',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  @Public()
  @Put('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    try {
      return await this.resetPasswordUseCase.execute(dto);
    } catch (error) {
      throw new BadRequestException('Failed to reset password', {
        code: 'RESET_PASSWORD_FAILED',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  @Public()
  @Post('register-device')
  async registerDevice(
    @Request() req: AuthenticatedRequest,
    @Body()
    dto: RegisterDeviceDto
  ) {
    try {
      return await this.validateMobileUserUseCase.execute(req.user.userId, dto);
    } catch (error) {
      throw new BadRequestException('Failed to register device', {
        code: 'DEVICE_REGISTRATION_FAILED',
        details: {
          userId: req.user.userId,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }
}
