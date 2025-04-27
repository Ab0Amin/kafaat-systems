import { SubdomainMiddleware } from './subdomain.middleware';
import { RequestMethod } from '@nestjs/common';
import { TenantMiddleware } from './tenant.middlewar';

export const MIDDLEWARES = [
  {
    middleware: SubdomainMiddleware,
    exclude: [],
  },
  {
    middleware: TenantMiddleware,
    exclude: [
      { path: 'tenant/register', method: RequestMethod.POST },
      { path: 'admin/(.*)', method: RequestMethod.ALL },
    ],
  },
];
