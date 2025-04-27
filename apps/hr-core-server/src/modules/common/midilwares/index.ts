import { TenantMiddleware } from '@kafaat-systems/tenant';
import { SubdomainMiddleware } from './subdomain.middleware';
import { RequestMethod } from '@nestjs/common';

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
