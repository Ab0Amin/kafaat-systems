import { IsString, IsNotEmpty, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import AdminDto from '../../admin/dto/create-admin.dto';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  domain!: string;

  @ValidateNested()
  @Type(() => AdminDto)
  admin!: AdminDto;
}
