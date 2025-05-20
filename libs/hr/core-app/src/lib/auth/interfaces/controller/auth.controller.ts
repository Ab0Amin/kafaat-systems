import { Body, Controller, Post, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { SetPasswordDto } from '../../application/dtos/set-password.dto';
import { SetPasswordUseCase } from '../../application/use-cases/set-password.use-case';

@Controller('auth2')
export class AuthController {
  constructor(private readonly SetPasswordUseCase: SetPasswordUseCase) {}
  @Post('login')
  getProfile(@Request() req: ExpressRequest) {
    return 'hi';
  }

  @Post('set-password')
  async setPassword(@Body() dto: SetPasswordDto) {
    return this.SetPasswordUseCase.execute(dto);
  }
}
