import { Type } from 'class-transformer';
import { IsInt, Validate } from 'class-validator';

import { GroupIdDto } from './group-id.dto';
import { MemberExistsRule } from '../validation-rules/member-exists.validation-rule';

export class GroupMemberIdDto extends GroupIdDto {
  @Type(() => Number)
  @IsInt()
  @Validate(MemberExistsRule)
  memberId: number;
}
