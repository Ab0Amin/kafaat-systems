import { IsString, IsNotEmpty, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export default class AdminDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
