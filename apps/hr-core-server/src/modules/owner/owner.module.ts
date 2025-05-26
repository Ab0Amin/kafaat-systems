import { Module } from '@nestjs/common';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from '@kafaat-systems/entities';
import { CommonModule, SharedAuthModule } from '@kafaat-systems/core-app';

@Module({
  imports: [TypeOrmModule.forFeature([TenantEntity]), CommonModule, SharedAuthModule],
  controllers: [OwnerController],
  providers: [OwnerService],
  exports: [OwnerService],
})
export class OwnerModule {}
