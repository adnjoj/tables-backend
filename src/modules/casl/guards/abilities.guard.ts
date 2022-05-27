import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ForbiddenError } from '@casl/ability';

import { RequiredRule } from '../types/required-rule.type';
import { CHECK_ABILITIES_KEY } from '../decorators/check-abilities.decorator';
import { CaslAbilityFactory } from '../factories/casl-ability.factory';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRule[]>(
        CHECK_ABILITIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    rules.every((rule) => {
      ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
    });
    return true;
  }
}
