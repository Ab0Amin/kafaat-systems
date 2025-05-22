// import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
// import { TenantEntity } from '@kafaat-systems/entities';
// import { createTenantDataSource, getTenantDataSource } from '@kafaat-systems/database';
// @Injectable()
// export class SubdomainService {
//   private readonly logger = new Logger(SubdomainService.name);
//   // constructor() {}
//   async getTenantByDomain(domain: string): Promise<TenantEntity | null> {
//     const ownerDS = await getTenantDataSource('owner');

//     try {
//       const tenant = await ownerDS.getRepository(TenantEntity).findOne({
//         where: { domain },
//       });
//       return tenant;
//     } catch (error) {
//       this.logger.error(`Error getting tenant by domain ${domain}: ${(error as Error).message}`);
//       return null;
//     }
//   }

//   slugify(name: string) {
//     return name.toLowerCase().replace(/\s+/g, '_');
//   }
// }
