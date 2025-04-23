import { PartialType } from '@nestjs/mapped-types';
import { AdminDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(AdminDto) {}
