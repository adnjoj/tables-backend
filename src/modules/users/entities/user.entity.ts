import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Contact } from 'src/modules/contacts/entities/contact.entity';

import { ToPhone } from '../transformers/to-phone.transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @IsString()
  @MinLength(1)
  username!: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  @IsString()
  @MinLength(6)
  password!: string;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column({ unique: true, nullable: true })
  @Exclude({ toPlainOnly: true })
  @IsString({ message: 'phone must be a phone number' })
  @Transform(ToPhone, { toClassOnly: true })
  phone!: string | null;

  @Column({ type: 'bool', default: false })
  @IsBoolean()
  phoneIsPublic!: boolean;

  @OneToMany(() => Contact, (contact) => contact.owner)
  @Exclude()
  contacts!: Promise<Contact[]>;

  @Expose({ name: 'phone' })
  getPhone() {
    return this.phoneIsPublic ? this.phone : null;
  }
}
