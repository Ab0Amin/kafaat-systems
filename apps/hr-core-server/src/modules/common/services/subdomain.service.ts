import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
// import { getDataSourceOptions } from './database.config';
import { TenantEntity } from '@kafaat-systems/entities';
import { TemplateSchemaService } from './template-schema.service';
import { createTenantDataSource } from '@kafaat-systems/database';
@Injectable()
export class SubdomainService {
  private readonly logger = new Logger(SubdomainService.name);

  // constructor(
  //   private dataSource: DataSource,
  //   private templateSchemaService: TemplateSchemaService
  // ) {}
  async getTenantByDomain(domain: string): Promise<TenantEntity | null> {
    const ownerDS = createTenantDataSource('owner');
    if (!ownerDS.isInitialized) {
      await ownerDS.initialize();
    }

    try {
      const tenant = await ownerDS.getRepository(TenantEntity).findOne({
        where: { domain, isActive: true },
      });
      return tenant;
    } catch (error) {
      this.logger.error(
        `Error getting tenant by domain ${domain}: ${(error as Error).message}`
      );
      return null;
    } finally {
      await ownerDS.destroy();
    }
  }

  slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, '_');
  }
}
