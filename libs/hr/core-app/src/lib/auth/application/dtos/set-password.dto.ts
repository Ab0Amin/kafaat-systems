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

export class SetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain 1 uppercase letter, and 1 number',
  })
  password!: string;

  @IsString()
  @Validate(MatchPasswordConstraint)
  confirmPassword!: string;
}
