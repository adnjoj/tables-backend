import { Ability } from '@casl/ability';

import { Action } from '../enums/action.enum';
import { Subjects } from './subjects.type';

export type AppAbility = Ability<[Action, Subjects]>;
