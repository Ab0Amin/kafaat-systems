// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository } from 'typeorm';
// import { TenantContextService } from './tenant-context.service';
// import { TenantEntity, TenantSettings } from '@kafaat-systems/entities';

// @Injectable()
// export class TenantConfigService {
//   private tenantRepo: Repository<TenantEntity>;

//   constructor(
//     private dataSource: DataSource,
//     private tenantContext: TenantContextService
//   ) {
//     // Create a repository for the owner schema
//     this.tenantRepo = this.dataSource.getRepository(TenantEntity);
//   }

//   async getTenantConfig(): Promise<TenantSettings> {
//     const tenantId = this.tenantContext.getTenantId();
//     if (!tenantId) {
//       return {};
//     }

//     const tenant = await this.tenantRepo.findOne({
//       where: { id: Number(tenantId) },
//     });

//     return tenant?.settings || {};
//   }

//   async updateTenantConfig(config: TenantSettings): Promise<void> {
//     const tenantId = this.tenantContext.getTenantId();
//     if (!tenantId) {
//       throw new Error('No tenant context found');
//     }

//     await this.tenantRepo.update(
//       { id: Number(tenantId) },
//       { settings: config }
//     );
//   }
// }
