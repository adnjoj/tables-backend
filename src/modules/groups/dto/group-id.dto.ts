import { Type } from 'class-transformer';
import { IsInt, Validate } from 'class-validator';
import { GroupExistsRule } from '../validation-rules/group-exists.validation-rule';

export class GroupIdDto {
  @Type(() => Number)
  @IsInt()
  @Validate(GroupExistsRule)
  groupId: number;
}
