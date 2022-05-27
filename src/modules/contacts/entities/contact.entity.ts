import { IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';

@Entity('contacts')
@Unique('unique_owner_target', ['owner', 'target'])
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  label!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  target!: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner!: User;
}
