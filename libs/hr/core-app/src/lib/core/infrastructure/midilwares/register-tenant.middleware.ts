import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { SharedCreateTenantDto } from '../../application/dtos/create-tenant.dto';
import { GetTenantByDomainUseCase } from '../../application/use-cases/get-tenant-by-domain.use-case';

@Injectable()
export class RegisterTenantMiddleware implements NestMiddleware {
  constructor(
    private readonly getTenantByDomainUseCase: GetTenantByDomainUseCase,
    private readonly dataSource: DataSource
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'POST') {
      return next();
    }
    const dto = req.body as SharedCreateTenantDto;

    // Validate email domain matches tenant domain
    const emailDomain = dto.admin.email.split('@')[1].split('.')[0].toLowerCase();

    const tenantDomain = dto.domain.toLowerCase();

    if (emailDomain !== tenantDomain) {
      throw new BadRequestException(
        `Email domain must match tenant domain. Email domain: ${emailDomain}, Tenant domain: ${tenantDomain}`
      );
    }

    // Check if tenant name and domain already exist
    const [existingName, existingDomain] = await Promise.all([
      this.dataSource.query(`SELECT name FROM owner.tenants WHERE LOWER(name) = LOWER($1)`, [
        dto.name,
      ]),
      this.getTenantByDomainUseCase.execute(dto.domain),
    ]);

    if (existingName.length > 0) {
      throw new BadRequestException(`Tenant name "${dto.name}" is already in use.`);
    }

    if (existingDomain) {
      throw new BadRequestException(`Domain "${dto.domain}" is already in use.`);
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/;
    if (!domainRegex.test(dto.domain)) {
      throw new BadRequestException(
        'Domain must contain only letters, numbers, and hyphens, and cannot start or end with a hyphen.'
      );
    }
    next();
  }
}
