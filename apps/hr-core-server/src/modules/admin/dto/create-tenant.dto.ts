import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsPhoneNumber,
  IsEmpty,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AdminDto } from './create-admin.dto';

export class CreateTenantDto {
  @ApiProperty({
    example: 'Acme Corporation',
    description: 'The name of the tenant',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'acme.com',
    description: 'The domain name of the tenant',
  })
  @IsString()
  @IsNotEmpty()
  domain!: string;

  @ApiProperty({
    example: 'starter',
    description: 'The subscription plan for the tenant',
  })
  @Transform(({ value }) => value ?? 'starter')
  @IsString()
  plan = 'starter';

  @ApiProperty({
    example: '200',
    description: 'The number of max users for the tenant',
  })
  @Transform(({ value }) => value ?? 200)
  @IsNumber()
  maxUsers = 200;

  @ApiProperty({
    example: '01222222',
    description: 'The contact phone of the tenant',
  })
  @IsOptional()
  @IsPhoneNumber()
  contactPhone!: string;

  @ApiProperty({
    type: () => AdminDto,
    description: 'The admin user details for the tenant',
  })
  @ValidateNested()
  @Type(() => AdminDto)
  admin!: AdminDto;
}
