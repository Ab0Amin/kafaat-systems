export type RoleType = 'admin' | 'user' | 'owner';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  schema_name: string;
  isActive: boolean;
  plan: string;
  maxUsers: number;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}
export interface User {
  id: string;
  firstName: string;
  name: string;
  lastName: string;
  email: string;
  passwordHash?: string;
  isActive: boolean;
  role: RoleType;
  accessToken?: string;
  refreshToken?: string;
  schemaName?: string;
  createdAt: string;
  updatedAt: string;
}
