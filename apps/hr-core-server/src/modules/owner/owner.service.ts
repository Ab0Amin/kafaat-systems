// import { BadRequestException, Injectable, Logger } from '@nestjs/common';
// import { DataSource } from 'typeorm';
// import { RoleType, TenantEntity, UserEntity } from '@kafaat-systems/entities';
// import { getTenantDataSource, createTenantDataSource } from '@kafaat-systems/database';
// import { CreateTenantDto } from './dto/create-tenant.dto';
// // import { SubdomainService } from '../common/services/subdomain.service';
// // import { TemplateSchemaService } from '../common/services/template-schema.service';
// import { TokenService } from '../auth/service/temp-token.service';
// import { EmailService } from '../auth/service/email.service';

// @Injectable()
// export class OwnerService {
//   constructor(
//     private dataSource: DataSource,
//     private readonly subdomainService: SubdomainService,
//     private templateSchemaService: TemplateSchemaService,
//     private readonly tokenService: TokenService,
//     private readonly emailService: EmailService
//   ) {}

//   async runMigrationForAllTenants() {
//     // Get all active tenants

//     const ownerDS = await getTenantDataSource('owner');

//     try {
//       const tenants = await ownerDS.getRepository(TenantEntity).find({
//         where: { isActive: true },
//       });

//       const results = [];

//       // Run migrations for each tenant
//       for (const tenant of tenants) {
//         try {
//           const tenantDS = await getTenantDataSource(tenant.schema_name);
//           try {
//             await tenantDS.runMigrations();
//             results.push({
//               tenant: tenant.name,
//               schema: tenant.schema_name,
//               success: true,
//             });
//           } catch (error: unknown) {
//             results.push({
//               tenant: tenant.name,
//               schema: tenant.schema_name,
//               success: false,
//               error: error instanceof Error ? error.message : String(error),
//             });
//           }
//         } catch (error: unknown) {
//           results.push({
//             tenant: tenant.name,
//             schema: tenant.schema_name,
//             success: false,
//             error:
//               error instanceof Error
//                 ? `Failed to initialize connection: ${error.message}`
//                 : String(error),
//           });
//         }
//       }

//       return {
//         totalTenants: tenants.length,
//         successful: results.filter(r => r.success).length,
//         failed: results.filter(r => !r.success).length,
//         details: results,
//       };
//     } catch (error: unknown) {
//       const message = error instanceof Error ? error.message : 'An unexpected error occurred';
//       console.log(message);

//       return;
//     }
//   }

//   async getTenantStats() {
//     const ownerDS = await getTenantDataSource('owner');
//     try {
//       const tenants = await ownerDS.getRepository(TenantEntity).find();

//       const stats = {
//         totalTenants: tenants.length,
//         activeTenants: tenants.filter(t => t.isActive).length,
//         inactiveTenants: tenants.filter(t => !t.isActive).length,
//         tenantsByPlan: tenants.reduce((acc, tenant) => {
//           acc[tenant.plan || 'default'] = (acc[tenant.plan || 'default'] || 0) + 1;
//           return acc;
//         }, {} as Record<string, number>),
//       };

//       return stats;
//     } catch (error: unknown) {
//       const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//       console.log(errorMessage);
//       return;
//     }
//   }

//   async getTenants() {
//     const ownerDS = await getTenantDataSource('owner');
//     try {
//       const tenants = await ownerDS.getRepository(TenantEntity).find();

//       return tenants;
//     } catch (error: unknown) {
//       const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//       console.log(errorMessage);
//       return;
//     }
//   }

//   async deactivateTenant(id: string) {
//     const ownerDS = await getTenantDataSource('owner');
//     try {
//       await ownerDS.getRepository(TenantEntity).update(id, { isActive: false });
//       return { success: true, message: 'Tenant deactivated successfully' };
//     } catch (error: unknown) {
//       const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//       console.log(errorMessage);

//       return;
//     }
//   }

//   async activateTenant(id: string) {
//     const ownerDS = await getTenantDataSource('owner');
//     try {
//       await ownerDS.getRepository(TenantEntity).update(id, { isActive: true });
//       return { success: true, message: 'Tenant deactivated successfully' };
//     } catch (error: unknown) {
//       const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//       console.log(errorMessage);
//       return;
//     }
//   }
//   async createNewTenant(dto: CreateTenantDto) {
//     const schemaName = this.subdomainService.slugify(dto.domain);
//     let resetToken;
//     let createdTenant;
//     const TokenDuratuon = 3; // days

//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();

//     // Create schema **without** transaction first
//     await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

//     // Initialize tenantDS now

//     const tenantDS = createTenantDataSource(schemaName);
//     if (!tenantDS.isInitialized) {
//       await tenantDS.initialize();
//     }
//     try {
//       // Now start transaction for the rest
//       await queryRunner.startTransaction();

//       // Step 3: Clone template tables into new schema
//       await this.templateSchemaService.cloneTemplateToSchema(schemaName, tenantDS);

//       // Step 4: Create admin user
//       // const passwordHash = await bcrypt.hash(dto.admin.password, 10);

//       createdTenant = await tenantDS.getRepository(UserEntity).save({
//         firstName: dto.admin.firstName,
//         lastName: dto.admin.lastName,
//         email: dto.admin.email,
//         // passwordHash: '',
//         isActive: false,
//         role: RoleType.ADMIN,
//         schemaName: schemaName,
//       });

//       // Step 5: Save tenant info into owner schema
//       const ownerDS = await getTenantDataSource('owner');
//       try {
//         // createdAdmin = await ownerDS.manager.transaction(async (manager) => {
//         //   await manager.getRepository(TenantEntity).save({
//         await ownerDS.getRepository(TenantEntity).save({
//           name: dto.name,
//           domain: dto.domain,
//           schema_name: schemaName,
//           isActive: true,
//           contactEmail: dto.admin.email,
//           plan: dto.plan,
//           phone: dto.contactPhone,
//           maxUsers: dto.maxUsers,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//       } catch (error: unknown) {
//         const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//         console.log(errorMessage);
//       } finally {
//         await ownerDS.destroy();
//       }
//       // Step 6: If everything went fine, commit the transaction
//       await queryRunner.commitTransaction();
//       // Step 7: After commit, send email (email sending should NOT be inside transaction)
//       resetToken = await this.tokenService.createResetToken(
//         createdTenant?.id,
//         tenantDS,
//         TokenDuratuon
//       );
//     } catch (error: unknown) {
//       // Step 8: Rollback if anything fails
//       await queryRunner.rollbackTransaction();
//       await this.dataSource.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);

//       throw new BadRequestException(
//         `Failed to register tenant: ${error instanceof Error ? error.message : 'Unknown error'}`
//       );
//     } finally {
//       await queryRunner.release();
//     }

//     const expiresAt = new Date();
//     expiresAt.setDate(new Date().getDate() + TokenDuratuon);

//     await this.emailService.sendSetPasswordEmail({
//       to: dto.admin.email,

//       ClientName: `${dto.admin.firstName} ${dto.admin.lastName}`,
//       expiryDate: expiresAt.toString(),
//       url: `https://${dto.domain}.${process.env.NEXT_PUBLIC_API_URL_HR}/set-password?token=${resetToken?.plainToken}`,
//       operating_system: 'Web',
//       browser_name: 'Any',
//       button_text: 'Set Password',
//       support_url: 'support.kbs.sa',
//       product_name: 'KAFAAT SYSTEMS',
//     });
//     return {
//       success: true,
//       message: `Tenant ${dto.name} successfully registered with schema ${schemaName}.`,
//       tenant: {
//         name: dto.name,
//         domain: dto.domain,
//         schema: schemaName,
//         admin: createdTenant,
//         admin1: resetToken,
//       },
//     };
//   }
//   async deleteTenant(id: string) {
//     const ownerDS = await getTenantDataSource('owner');
//     try {
//       Logger.log('trying');

//       const tenant = await ownerDS.getRepository(TenantEntity).findOneBy({ id: id });

//       if (!tenant || !tenant?.name) {
//         throw new BadRequestException(`Tenant with ID ${id} not found`);
//       }

//       const schemaName = tenant.name;

//       await ownerDS.getRepository(TenantEntity).delete(id);

//       if (schemaName) {
//         await ownerDS.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
//       }

//       return {
//         success: true,
//         message: `Tenant ${id} and schema "${schemaName}" successfully deleted.`,
//       };
//     } catch (error: unknown) {
//       throw new BadRequestException(
//         `Failed to delete tenant: ${error instanceof Error ? error.message : 'Unknown error'}`
//       );
//     }
//   }
// }
