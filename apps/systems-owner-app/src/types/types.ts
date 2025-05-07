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
