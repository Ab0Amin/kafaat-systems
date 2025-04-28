import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { TokenService } from './service/temp-token.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '@kafaat-systems/entities';
import { Repository } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>
  ) {}
  @Post('set-password')
  // async setPassword(@Body() dto: SetPasswordDto) {
  //   const resetToken = await this.tokenService.validateToken(dto.token);

  //   if (!resetToken) {
  //     throw new BadRequestException('Invalid or expired token');
  //   }

  //   const admin = resetToken.admin;

  //   const passwordHash = await bcrypt.hash(dto.password, 10);
  //   admin.passwordHash = passwordHash;

  //   await this.adminRepository.save(admin);
  //   await this.tokenService.markTokenAsUsed(dto.token);

  //   return { message: 'Password set successfully' };
  // }
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
