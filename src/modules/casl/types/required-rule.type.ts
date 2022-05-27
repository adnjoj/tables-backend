import { Action } from '../enums/action.enum';
import { Subjects } from './subjects.type';

export type RequiredRule = { action: Action; subject: Subjects };
