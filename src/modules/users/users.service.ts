import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(where: Partial<User>): Promise<User | null> {
    return this.userRepository.findOne({ where });
  }

  create(dto: CreateUserDto): Promise<User> {
    return this.userRepository.save(dto);
  }

  async checkPhone(phone: string): Promise<boolean> {
    return !Boolean(await this.findOne({ phone }));
  }
}
