import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { GroupsService } from '../groups.service';

@ValidatorConstraint({ name: 'MemberExists', async: true })
@Injectable()
export class MemberExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly groupsService: GroupsService) {}

  async validate(_value: string, args: ValidationArguments) {
    const { groupId, memberId } = args.object as any;
    const group = await this.groupsService.findOne({ id: groupId });
    return group.members.find(({ id }) => id === memberId) ? true : false;
  }

  defaultMessage() {
    return 'Member with such id does not belong to that group';
  }
}
