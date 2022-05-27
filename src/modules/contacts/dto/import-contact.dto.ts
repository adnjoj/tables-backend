import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

import { Contact } from '../entities/contact.entity';

export class ImportContactDto extends PickType(Contact, ['label']) {
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
