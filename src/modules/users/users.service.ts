import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(where: Partial<User>): Promise<User | undefined> {
    return this.userRepository.findOne({ where });
  }

  create(dto: CreateUserDto): Promise<User> {
    return this.userRepository.save(dto);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UpdateResult> {
    if (Object.keys(dto).length === 0) {
      return Promise.resolve({ affected: 0, raw: [], generatedMaps: [] });
    }

    const { email, phone } = dto;

    if (email) {
      const userByEmail = await this.userRepository.findOne({ email });
      if (userByEmail && userByEmail.id !== id) {
        throw new BadRequestException('That email is already taken');
      }
    }

    if (phone) {
      const userByPhone = await this.userRepository.findOne({ phone });
      if (userByPhone && userByPhone.id !== id) {
        throw new BadRequestException('That phone is already taken');
      }
    }

    return this.userRepository.update(id, dto);
  }

  async checkPhone(phone: string): Promise<boolean> {
    return !Boolean(await this.findOne({ phone }));
  }
}
