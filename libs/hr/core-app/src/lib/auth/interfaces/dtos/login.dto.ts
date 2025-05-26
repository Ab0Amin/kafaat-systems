import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SharedLoginDto {
  @ApiProperty({
    example: '',
    description: 'The email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class SharedLoginResponseDto {
  access_token!: string;
  refresh_token!: string;
  user!: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    subdomain: string;
  };
}
