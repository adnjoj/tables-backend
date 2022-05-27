import { RequiredRule } from 'src/modules/casl/types/required-rule.type';
import { Action } from 'src/modules/casl/enums/action.enum';
import { Group } from '../entities/group.entity';

export class CreateGroupAbility implements RequiredRule {
  action = Action.Create;
  subject = Group;
}
