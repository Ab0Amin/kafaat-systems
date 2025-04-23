import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@kafaat-systems/entities';

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  @Post()
  async create(@Body() userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }
}
