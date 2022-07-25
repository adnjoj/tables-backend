import { Exclude, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Contact } from 'src/modules/contacts/entities/contact.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  email!: string | null;

  @Column({ unique: true, nullable: true })
  @Exclude({ toPlainOnly: true })
  @IsPhoneNumber()
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
