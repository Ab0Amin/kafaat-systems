import { IsNotEmpty, IsString } from 'class-validator';

export class SharedResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  email!: string;
}
