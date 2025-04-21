export class CreateTenantDto {
  name: string;
  domain: string;
  admin: {
    fullName: string;
    email: string;
    password: string;
  };
}
