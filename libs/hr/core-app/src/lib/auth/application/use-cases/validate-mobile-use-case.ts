import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { getTenantDataSource } from '@kafaat-systems/database';
import { MobileDeviceEntity, UserEntity } from '@kafaat-systems/entities';
import { SharedRegisterDeviceDto } from '../../interfaces/dtos/register-device.dto';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerException,
} from '@kafaat-systems/exceptions';

@Injectable()
export class ValidateMobileUserUseCase {
  constructor(private readonly tenantContextService: TenantContextService) {}

  async execute(userId: string, dto: SharedRegisterDeviceDto) {
    try {
      const schema = this.tenantContextService.getSchema();
      const tenantDS = await getTenantDataSource(schema);

      const userRepo = tenantDS.getRepository(UserEntity);
      const deviceRepo = tenantDS.getRepository(MobileDeviceEntity);

      const user = await userRepo.findOne({ where: { id: userId }, relations: ['device'] });
      if (!user) {
        throw new BadRequestException('User not found', {
          code: 'USER_NOT_FOUND',
          details: {
            id: userId,
          },
        });
      }

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
            throw new ForbiddenException('Not trusted device', {
              code: 'UNTRUSTED_DEVICE',
              details: {
                userId,
                currentDeviceId: user.device.deviceId,
                requestedDeviceId: dto.deviceId,
              },
            });
          }
        }
      }

      // create new device
      dto.registeredAt = new Date();
      const newDevice = deviceRepo.create({ ...dto, user });

      try {
        await deviceRepo.save(newDevice);
      } catch (error) {
        throw new BadRequestException('Failed to save device', {
          code: 'DEVICE_SAVE_FAILED',
          details: {
            error: error instanceof Error ? error.message : 'Unknown error',
            deviceId: dto.deviceId,
            model: dto.model,
          },
        });
      }

      return { message: 'Device created' };
    } catch (error) {
      // Re-throw NestJS exceptions
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerException('Device validation failed', {
        code: 'DEVICE_VALIDATION_FAILED',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId,
          deviceId: dto.deviceId,
        },
      });
    }
  }
}
