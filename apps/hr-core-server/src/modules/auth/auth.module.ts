import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SharedAuthModule } from '@kafaat-systems/core-app';

@Module({
  imports: [SharedAuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
