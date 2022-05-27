import { IsEmail, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @IsString()
  @IsEmail()
  email!: string;

  @Column('bool', { default: false })
  isVerified!: boolean;
}
