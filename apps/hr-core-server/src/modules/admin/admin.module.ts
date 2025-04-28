import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from '@kafaat-systems/entities';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([TenantEntity]), CommonModule],
  controllers: [AdminController],
  providers: [AdminService, CommonModule],
  exports: [AdminService],
})
export class AdminModule {}
