import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { GroupsService } from '../groups.service';

@ValidatorConstraint({ name: 'GroupExists', async: true })
@Injectable()
export class GroupExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly groupsService: GroupsService) {}

  async validate(value: number) {
    const group = await this.groupsService.findOne({ id: value });
    return group ? true : false;
  }

  defaultMessage() {
    return 'Group with such id does not exist';
  }
}
