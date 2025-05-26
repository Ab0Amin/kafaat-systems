import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Matches,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
@ValidatorConstraint({ name: 'MatchPassword', async: false })
class MatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as { password: string };
    return object.password === confirmPassword;
  }

  defaultMessage(_args: ValidationArguments) {
    const object = _args.object as { password: string };
    return `${_args.property} does not match ${object.password}`;
  }
}

export class SharedSetPasswordDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  @IsString()
  token!: string;
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain 1 uppercase letter, and 1 number',
  })
  password!: string;
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  @Validate(MatchPasswordConstraint)
  confirmPassword!: string;
}
