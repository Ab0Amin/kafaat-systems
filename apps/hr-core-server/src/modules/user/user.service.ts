import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@kafaat-systems/entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
