import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from './service/email.service';
import { TokenService } from './service/temp-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity, ResetTokenEntity } from '@kafaat-systems/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResetTokenEntity]),
    TypeOrmModule.forFeature([AdminEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, TokenService],
  exports: [AuthService, EmailService, TokenService],
})
export class AuthModule {}
