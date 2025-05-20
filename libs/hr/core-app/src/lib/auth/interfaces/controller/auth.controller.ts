import { Controller, Post, Body, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

@Controller('auth2')
export class AuthController {
  @Post('login')
  getProfile(@Request() req: ExpressRequest) {
    return 'hi';
  }
}
