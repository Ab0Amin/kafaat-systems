import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@kafaat-systems/entities';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('User')
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    this.logger.log('GET /users - Finding all users');
    return this.userRepository.find();
  }

  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    this.logger.log(`POST /users - Creating new user: ${userData.email}`);
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }
}
