import { Exclude } from 'class-transformer';
import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';
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
  email?: string;

  @Column({ unique: true, nullable: true })
  @IsPhoneNumber()
  phone?: string;

  @OneToMany(() => Contact, (contact) => contact.owner)
  @Exclude()
  contacts: Promise<Contact[]>;
}
