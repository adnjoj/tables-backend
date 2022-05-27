import { Injectable } from '@nestjs/common';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';

import { AppAbility } from '../types/app-ability.type';
import { Action } from '../enums/action.enum';
import { Subjects } from '../types/subjects.type';

import { User } from 'src/modules/users/entities/user.entity';
import { Contact } from 'src/modules/contacts/entities/contact.entity';
import { Group } from 'src/modules/groups/entities/group.entity';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>,
    );

    can(Action.Read, 'all');

    cannot(Action.Manage, Group).because(
      'You can only read groups you belong to',
    );
    cannot([Action.Update, Action.Delete, Action.RemoveMembers], Group).because(
      'You can only manage groups that you own',
    );

    can(Action.Create, Group);
    can([Action.Read, Action.InviteMembers], Group, {
      members: { $elemMatch: { id: { $eq: user.id } } },
    });
    can([Action.Update, Action.Delete], Group, {
      'owner.id': { $eq: user.id },
    } as any);

    cannot(Action.Manage, Contact).because('You can only manage your contacts');

    can(Action.Create, Contact);
    can([Action.Read, Action.Update, Action.Delete], Contact, {
      'owner.id': { $eq: user.id },
    } as any);

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
