import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Group } from 'src/modules/groups/entities/group.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  text!: string;

  @ManyToOne(() => User)
  @JoinColumn()
  sender?: User;

  @ManyToOne(() => User)
  @JoinColumn()
  @Type(() => PickType(User, ['id']))
  @IsOptional()
  @IsObject()
  receiverUser?: User;

  @ManyToOne(() => Group)
  @JoinColumn()
  @Type(() => PickType(Group, ['id']))
  @IsOptional()
  @IsObject()
  receiverGroup?: Group;

  @CreateDateColumn()
  createdAt!: Date;
}
