import { Injectable, BadRequestException } from '@nestjs/common';
import { getTenantDataSource } from '@kafaat-systems/database';
import { UserEntity } from '@kafaat-systems/entities';
import { ResetPasswordDto } from '../../interfaces/dtos/reset-password.dto';
import { TokenService } from '../../infrastructure/service/temp-token.service';
import { EmailService } from '../../infrastructure/service/email.service';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService
  ) {}

  async execute(dto: ResetPasswordDto) {
    const userEmail = dto.email;
    const durationPerMinutes = 15;
    const TokenDuration = durationPerMinutes * 60 * 1000;

    const domain = userEmail.split('@')[1].split('.')[0].toLowerCase();

    const tenantDS = await getTenantDataSource(domain);
    const userRepo = tenantDS.getRepository(UserEntity);

    const user = await userRepo.findOne({ where: { email: userEmail } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.isActive) {
      throw new BadRequestException('User is not active');
    }

    const resetToken = await this.tokenService.createResetToken(user.id, tenantDS, TokenDuration);

    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + TokenDuration);

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

    return {
      success: true,
      message: `Reset email sent to ${userEmail}`,
      tenant: {
        email: userEmail,
        expiresAt,
        token: resetToken,
      },
    };
  }
}
