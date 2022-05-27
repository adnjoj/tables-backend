import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsObject } from 'class-validator';

import { Message } from '../entities/message.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Group } from 'src/modules/groups/entities/group.entity';

export class CreateMessageDto extends PickType(Message, ['text']) {
  @Type(() => PickType(User, ['id']))
  @IsObject()
  sender?: Pick<User, 'id'>;

  @Type(() => PickType(User, ['id']))
  @IsObject()
  receiverUser?: Pick<User, 'id'>;

  @Type(() => PickType(Group, ['id']))
  @IsObject()
  receiverGroup?: Pick<Group, 'id'>;
}
