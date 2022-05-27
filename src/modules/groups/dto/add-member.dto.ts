import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsObject } from 'class-validator';

import { User } from 'src/modules/users/entities/user.entity';

export class AddMemberDto {
  @Type(() => PickType(User, ['id']))
  @IsObject()
  user: User;
}
