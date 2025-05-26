import { Injectable } from '@nestjs/common';
import { getTenantDataSource } from '@kafaat-systems/database';
import { UserEntity } from '@kafaat-systems/entities';
import { SharedResetPasswordDto } from '../../interfaces/dtos/reset-password.dto';
import { TokenService } from '../../infrastructure/service/temp-token.service';
import { EmailService } from '../../infrastructure/service/email.service';
import {
  BadRequestException,
  NotFoundException,
  InternalServerException,
} from '@kafaat-systems/exceptions';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService
  ) {}

  async execute(dto: SharedResetPasswordDto) {
    try {
      const userEmail = dto.email;
      const durationPerMinutes = 15;
      const TokenDuration = durationPerMinutes * 60 * 1000;

      if (!userEmail || !userEmail.includes('@')) {
        throw new BadRequestException('Invalid email format', {
          code: 'INVALID_EMAIL_FORMAT',
          details: { email: userEmail },
        });
      }

      const domain = userEmail.split('@')[1].split('.')[0].toLowerCase();

      const tenantDS = await getTenantDataSource(domain);
      const userRepo = tenantDS.getRepository(UserEntity);

      const user = await userRepo.findOne({ where: { email: userEmail } });
      if (!user) {
        throw new NotFoundException('User not found', {
          code: 'USER_NOT_FOUND',
          details: { email: userEmail, domain: domain },
        });
      }

      if (!user.isActive) {
        throw new BadRequestException('User is not active', {
          code: 'USER_INACTIVE',
          details: {
            userId: user.id,
            email: userEmail,
          },
        });
      }

      const resetToken = await this.tokenService.createResetToken(user.id, tenantDS, TokenDuration);

      const expiresAt = new Date();
      expiresAt.setTime(expiresAt.getTime() + TokenDuration);

      try {
        await this.emailService.sendSetPasswordEmail({
          to: user.email,
          ClientName: `${user.firstName} ${user.lastName}`,
          expiryDate: expiresAt.toString(),
          url: `https://${domain}.${process.env.NEXT_PUBLIC_API_URL_HR}/set-password?token=${resetToken.plainToken}`,
          operating_system: 'Web',
          browser_name: 'Any',
          button_text: 'Set Password',
          support_url: 'support.kbs.sa',
          product_name: 'KAFAAT SYSTEMS',
        });
      } catch (emailError) {
        throw new InternalServerException('Failed to send reset password email', {
          code: 'EMAIL_SEND_FAILED',
          details: {
            error: emailError instanceof Error ? emailError.message : 'Unknown error',
            email: userEmail,
          },
        });
      }

      return {
        success: true,
        message: `Reset email sent to ${userEmail}`,
        tenant: {
          email: userEmail,
          expiresAt,
          token: resetToken,
        },
      };
    } catch (error) {
      throw new InternalServerException('Password reset failed', {
        code: 'PASSWORD_RESET_FAILED',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          email: dto.email,
        },
      });
    }
  }
}
