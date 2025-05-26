import { Injectable } from '@nestjs/common';
import { DataSource, MoreThan } from 'typeorm';
import { ResetTokenEntity } from '@kafaat-systems/entities';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class TokenService {
  private generateToken(length = 32): string {
    return randomBytes(length).toString('hex');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async createResetToken(
    adminId: string,
    tenantDS: DataSource,
    durationPerDay = 3
  ): Promise<{ plainToken: string }> {
    const resetTokenRepo = tenantDS.getRepository(ResetTokenEntity);

    const plainToken = this.generateToken();
    const hashedToken = this.hashToken(plainToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationPerDay);

    const resetToken = resetTokenRepo.create({
      token: hashedToken,
      expiresAt,
      adminId,
    });

    await resetTokenRepo.save(resetToken);

    return { plainToken };
  }

  async validateToken(plainToken: string, tenantDS: DataSource): Promise<ResetTokenEntity | null> {
    const resetTokenRepo = tenantDS.getRepository(ResetTokenEntity);
    const hashed = this.hashToken(plainToken);
    const token = await resetTokenRepo.findOne({
      where: {
        token: hashed,
        used: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    return token || null;
  }

  async markTokenAsUsed(plainToken: string, tenantDS: DataSource): Promise<void> {
    const resetTokenRepo = tenantDS.getRepository(ResetTokenEntity);
    const hashed = this.hashToken(plainToken);
    await resetTokenRepo.update({ token: hashed }, { used: true });
  }

  async deleteToken(plainToken: string, tenantDS: DataSource): Promise<void> {
    const resetTokenRepo = tenantDS.getRepository(ResetTokenEntity);
    const hashed = this.hashToken(plainToken);
    await resetTokenRepo.delete({ token: hashed });
  }
}
