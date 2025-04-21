import { IsString, IsEmail, IsNotEmpty, IsOptional, ValidateNested, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

class AdminDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AdminDto)
  admin?: AdminDto;
}
