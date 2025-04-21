import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { getDataSourceOptions } from '../config/typeorm.config';

@Injectable()
export class TenantService {
  constructor(private dataSource: DataSource) {}
  
  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    const ownerDS = new DataSource(getDataSourceOptions('owner'));
    await ownerDS.initialize();
    
    try {
      const tenant = await ownerDS.getRepository(Tenant).findOne({ 
        where: { domain, isActive: true } 
      });
      return tenant;
    } finally {
      await ownerDS.destroy();
    }
  }
}