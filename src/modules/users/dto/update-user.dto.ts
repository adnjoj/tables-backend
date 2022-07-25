import { PartialType, PickType } from '@nestjs/mapped-types';
import { ValidateIf } from 'class-validator';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(
  PickType(User, ['username', 'phone', 'email', 'phoneIsPublic']),
) {
  @ValidateIf((_o, value) => value !== undefined)
  username?: string;

  @ValidateIf((_o, value) => value !== undefined)
  phone?: string;

  @ValidateIf((_o, value) => value !== undefined)
  email?: string;

  @ValidateIf((_o, value) => value !== undefined)
  phoneIsPublic?: boolean;
}
