import { IsDate, IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SharedRegisterDeviceDto {
  @ApiProperty({ description: 'Unique identifier for the device', example: 'abc123def456' })
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @ApiProperty({ description: 'Platform of the device', example: 'iOS/Android/Web' })
  @IsEmpty()
  platform!: string;

  @ApiProperty({ description: 'Model of the device', example: 'iPhone 13 Pro' })
  @IsEmpty()
  model!: string;

  @ApiProperty({ description: 'OS version of the device', example: '15.0.1' })
  @IsEmpty()
  version!: string;

  @ApiProperty({ description: 'Whether to force update the device registration', default: false })
  forceUpdate = false;

  @ApiProperty({ description: 'Date when the device was registered', type: Date })
  @IsDate()
  registeredAt!: Date;
}
