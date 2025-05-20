import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity, ResetTokenEntity } from '@kafaat-systems/entities';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '@kafaat-systems/entities';
import { jwtConstants } from './infrastructure/security/strategies/jwt.constants.strategy';
import { AuthController } from './domain/interfaces/auth.controller';
import { EmailService } from './infrastructure/service/email.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { TokenService } from './infrastructure/service/temp-token.service';
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    TypeOrmModule.forFeature([UserEntity]), 

    TypeOrmModule.forFeature([ResetTokenEntity]),
    TypeOrmModule.forFeature([AdminEntity]),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, TokenService, EmailService],
  exports: [LoginUseCase, EmailService],
})
export class AuthModule {}
