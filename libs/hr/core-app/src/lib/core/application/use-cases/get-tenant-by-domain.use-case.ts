import { Injectable, Logger } from '@nestjs/common';
import { getTenantDataSource } from '@kafaat-systems/database';
import { TenantEntity } from '@kafaat-systems/entities';

@Injectable()
export class GetTenantByDomainUseCase {
  private readonly logger = new Logger(GetTenantByDomainUseCase.name);

  async execute(domain: string): Promise<TenantEntity | null> {
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
  }
}
