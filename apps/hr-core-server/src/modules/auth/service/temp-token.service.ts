import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ResetTokenEntity } from '@kafaat-systems/entities';
import { randomBytes } from 'crypto';

@Injectable()
export class TokenService {
  async createResetToken(
    adminId: string,
    tenantDS: DataSource,
    durationPerDay: 3
  ): Promise<ResetTokenEntity> {
    const resetTokenRepo = tenantDS.getRepository(ResetTokenEntity);

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationPerDay); // valid for 3 days

    const resetToken = resetTokenRepo.create({
      token,
      expiresAt,
      adminId,
    });

    return resetTokenRepo.save(resetToken);
  }

  // Validate Token in tenant-specific datasource
  async validateToken(
    token: string,
    tenantDS: DataSource
  ): Promise<ResetTokenEntity | null> {
    const resetTokenRepo = tenantDS.getRepository(ResetTokenEntity);

    const found = await resetTokenRepo.findOne({
      where: { token, used: false },
    });

    if (!found || found.expiresAt < new Date()) {
      return null;
    }

    return found;
  }

  async markTokenAsUsed(token: string, tenantDS: DataSource): Promise<void> {
    const resetTokenRepo = tenantDS.getRepository(ResetTokenEntity);
    await resetTokenRepo.update({ token }, { used: true });
  }
  async deleteToken(token: string, tenantDS: DataSource): Promise<void> {
    const resetTokenRepo = tenantDS.getRepository(ResetTokenEntity);
    await resetTokenRepo.delete({ token });
  }
}
