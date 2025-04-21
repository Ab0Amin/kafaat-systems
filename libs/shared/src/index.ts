export * from './lib/entities/user.entity';
export * from './lib/entities/tenant.entity';
export * from './lib/config/typeorm.config';
// export * from './lib/config/database.config';
export * from './lib/database.module';
export * from './lib/utils/tenant-datasource';

import { User } from './lib/entities/user.entity';
import { Tenant } from './lib/entities/tenant.entity';
export const entities_name = [User, Tenant];
