import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ResetTokenEntity } from '@kafaat-systems/entities';
import { randomBytes } from 'crypto';

@Injectable()
export class TokenService {
  async createResetToken(
    adminId: string,
    tenantDS: DataSource
  ): Promise<ResetTokenEntity> {
    const resetTokenRepo = tenantDS.getRepository(ResetTokenEntity);

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3); // valid for 3 days

    const resetToken = resetTokenRepo.create({
      token,
      expiresAt,
      adminId,
    });

    return resetTokenRepo.save(resetToken);
  }

  // Validate Token داخل tenant-specific datasource
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
