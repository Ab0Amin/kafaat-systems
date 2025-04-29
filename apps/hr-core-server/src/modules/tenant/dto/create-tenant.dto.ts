import { IsString, IsNotEmpty, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../../user/dto/create-user.dto';

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
    type: () => CreateUserDto,
    description: 'The admin user details for the tenant',
  })
  @ValidateNested()
  @Type(() => CreateUserDto)
  admin!: CreateUserDto;
}
