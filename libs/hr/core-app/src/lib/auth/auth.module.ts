import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity, ResetTokenEntity } from '@kafaat-systems/entities';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '@kafaat-systems/entities';
import { jwtConstants } from './infrastructure/security/strategies/jwt.constants.strategy';
import { EmailService } from './infrastructure/service/email.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { TokenService } from './infrastructure/service/temp-token.service';
import { AuthController } from './interfaces/controller/auth.controller';
import { SetPasswordUseCase } from './application/use-cases/set-password.use-case';
import { TenantContextModule } from '@kafaat-systems/tenant-context';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';
import { ValidateMobileUserUseCase } from './application/use-cases/validate-mobile-use-case';
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    TypeOrmModule.forFeature([UserEntity]),

    TypeOrmModule.forFeature([ResetTokenEntity]),
    TypeOrmModule.forFeature([AdminEntity]),
    TenantContextModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    SetPasswordUseCase,
    ResetPasswordUseCase,
    TokenService,
    EmailService,
    ValidateUserUseCase,
    ValidateMobileUserUseCase,
  ],
  exports: [LoginUseCase, EmailService],
})
export class AuthModule {}
