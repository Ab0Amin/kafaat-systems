import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from './service/email.service';
import { TokenService } from './service/temp-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity, ResetTokenEntity } from '@kafaat-systems/entities';
import { TenantContextModule } from '@kafaat-systems/tenant-context';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './strategies/jwt.constants.strategy';
import { UserEntity } from '@kafaat-systems/entities';
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    TypeOrmModule.forFeature([UserEntity]), // <- to inject UserEntity repository

    TypeOrmModule.forFeature([ResetTokenEntity]),
    TypeOrmModule.forFeature([AdminEntity]),
    TenantContextModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, TokenService],
  exports: [AuthService, EmailService, TokenService],
})
export class AuthModule {}
