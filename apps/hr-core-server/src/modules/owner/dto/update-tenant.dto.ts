import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  domain?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  plan?: string;

  @IsNumber()
  @IsOptional()
  maxUsers?: number;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;
}
