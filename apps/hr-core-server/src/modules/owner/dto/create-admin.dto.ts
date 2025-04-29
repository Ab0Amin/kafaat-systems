import { IsString, IsNotEmpty, ValidateNested, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the admin user',
  })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the admin user',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'The password for the admin user',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
