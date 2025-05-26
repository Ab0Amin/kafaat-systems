import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SharedResetPasswordDto {
  @ApiProperty({
    description: 'The email address of the user requesting password reset',
    example: 'user@example.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email!: string;
}
