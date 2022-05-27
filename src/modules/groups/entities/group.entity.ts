import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { IsString, MinLength } from 'class-validator';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  @MinLength(1)
  name!: string;

  @Column()
  @IsString()
  @MinLength(1)
  description!: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  owner?: User;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  members?: User[];
}
