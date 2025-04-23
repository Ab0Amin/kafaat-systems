import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@kafaat-systems/entities';

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }
}
