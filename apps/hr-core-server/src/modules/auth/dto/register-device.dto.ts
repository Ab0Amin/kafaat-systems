import { IsDate, IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @IsEmpty()
  platform!: string;

  @IsEmpty()
  model!: string;
  @IsEmpty()
  version!: string;

  forceUpdate = false;

  @IsDate()
  registeredAt!: Date;
}
