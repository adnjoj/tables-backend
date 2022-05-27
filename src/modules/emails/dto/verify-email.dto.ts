import { PickType } from '@nestjs/mapped-types';
import { IsString, Length } from 'class-validator';

import { Email } from '../entities/email.entity';

export class VerifyEmailDto extends PickType(Email, ['email']) {
  @IsString()
  @Length(6, 6)
  code!: string;
}
