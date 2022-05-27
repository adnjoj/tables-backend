import { SetMetadata } from '@nestjs/common';
import { RequiredRule } from '../types/required-rule.type';

export const CHECK_ABILITIES_KEY = 'check_ability';
export const CheckAbilities = (...rules: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITIES_KEY, rules);
