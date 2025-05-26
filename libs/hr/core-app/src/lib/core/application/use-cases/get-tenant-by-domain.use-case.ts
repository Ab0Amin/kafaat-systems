import { Injectable, Logger } from '@nestjs/common';
import { getTenantDataSource } from '@kafaat-systems/database';
import { TenantEntity } from '@kafaat-systems/entities';
import { DatabaseException } from '@kafaat-systems/exceptions';

@Injectable()
export class GetTenantByDomainUseCase {
  private readonly logger = new Logger(GetTenantByDomainUseCase.name);

  async execute(domain: string): Promise<TenantEntity | null> {
    if (!domain) {
      this.logger.warn('Attempted to get tenant with empty domain');
      return null;
    }

    try {
      const ownerDS = await getTenantDataSource('owner');

      try {
        const tenant = await ownerDS.getRepository(TenantEntity).findOne({
          where: { domain },
        });
        return tenant;
      } catch (error) {
        this.logger.error(`Error getting tenant by domain ${domain}: ${(error as Error).message}`);

        return null;
      }
    } catch (error) {
      this.logger.error(`Failed to connect to owner database: ${(error as Error).message}`);

      throw new DatabaseException('Failed to connect to tenant database', {
        code: 'DB_CONNECTION_ERROR',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        originalError: error,
      });
    }
  }
}
