import { SubdomainMiddleware } from './subdomain.middleware';
import { RequestMethod } from '@nestjs/common';
// import { TenantMiddleware } from './tenant.middlewar';
import { RegisterTenantMiddleware } from './register-tenant.middleware';

export const MIDDLEWARES = [
  {
    middleware: SubdomainMiddleware,
    exclude: [],
  },
  // {
  //   middleware: TenantMiddleware,
  //   exclude: [
  //     { path: 'tenant/register', method: RequestMethod.POST },
  //     { path: 'owner/(.*)', method: RequestMethod.ALL },
  //   ],
  // },
  {
    middleware: RegisterTenantMiddleware,
    include: [{ path: 'owner/register', method: RequestMethod.POST }],
  },
];
