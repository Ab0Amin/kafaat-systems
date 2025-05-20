import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { getTenantDataSource } from '@kafaat-systems/database';
// import * as base64 from 'base-64';
import * as bcrypt from 'bcrypt';
import { MobileDeviceEntity, UserEntity } from '@kafaat-systems/entities';
import { RegisterDeviceDto } from '../../interfaces/dtos/register-device.dto';

@Injectable()
export class ValidateMobileUserUseCase {
  constructor(private readonly tenantContextService: TenantContextService) {}

  async execute(userId: string, dto: RegisterDeviceDto) {
    const schema = this.tenantContextService.getSchema();
    const tenantDS = await getTenantDataSource(schema);

    const userRepo = tenantDS.getRepository(UserEntity);
    const deviceRepo = tenantDS.getRepository(MobileDeviceEntity);

    const user = await userRepo.findOne({ where: { id: userId }, relations: ['device'] });
    if (!user) throw new BadRequestException('User not found');

    if (user.device) {
      if (dto.forceUpdate) {
        // update existing device
        user.device.deviceId = dto.deviceId;
        user.device.model = dto.model;

        await deviceRepo.save(user.device);
        return { message: 'Device updated' };
      } else {
        if (user.device.deviceId == dto.deviceId) {
          return { message: 'Device already registered', skipped: true };
        } else {
          throw new ForbiddenException('Not trusted device');
        }
      }
    }
    // create new device
    dto.registeredAt = new Date();
    const newDevice = deviceRepo.create({ ...dto, user });

    try {
      await deviceRepo.save(newDevice);
    } catch (error) {
      Logger.log(error);
    }

    return { message: 'Device created' };
  }
}
