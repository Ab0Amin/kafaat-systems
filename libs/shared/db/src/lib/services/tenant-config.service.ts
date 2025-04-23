import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TenantContextService } from './tenant-context.service';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class TenantConfigService {
  private tenantRepo: Repository<Tenant>;

  constructor(
    private dataSource: DataSource,
    private tenantContext: TenantContextService
  ) {
    // Create a repository for the owner schema
    this.tenantRepo = this.dataSource.getRepository(Tenant);
  }

  async getTenantConfig(): Promise<Record<string, any>> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) {
      return {};
    }

    const tenant = await this.tenantRepo.findOne({
      where: { id: Number(tenantId) },
    });

    return tenant?.settings || {};
  }

  async updateTenantConfig(config: Record<string, any>): Promise<void> {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) {
      throw new Error('No tenant context found');
    }

    await this.tenantRepo.update(
      { id: Number(tenantId) },
      { settings: config }
    );
  }
}
