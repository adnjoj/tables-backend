import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenError } from '@casl/ability';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { CaslAbilityFactory } from '../casl/factories/casl-ability.factory';
import { Action } from '../casl/enums/action.enum';
import { Subjects } from '../casl/types/subjects.type';

import { Group } from './entities/group.entity';
import { User } from '../users/entities/user.entity';

import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  findAllForUser({ id }: User): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('groups')
      .leftJoinAndSelect('groups.members', 'users')
      .where('users.id = :id', { id })
      .getMany();
  }

  async findOne(
    where: Partial<Group>,
    caller: User = null,
  ): Promise<Group | null> {
    const group = await this.groupRepository.findOne({ where });
    if (caller) this.checkAbility(caller, Action.Read, group);

    return group;
  }

  async findGroupMembers(where: Partial<Group>, caller: User) {
    const group = await this.findOne(where, caller);
    return group?.members ?? [];
  }

  create(dto: Omit<Group, 'id'>): Promise<Group> {
    return this.groupRepository.save(dto);
  }

  async update(
    id: number,
    dto: UpdateGroupDto,
    caller: User,
  ): Promise<UpdateResult> {
    const group = await this.groupRepository.findOne(id);
    this.checkAbility(caller, Action.Update, group);

    return this.groupRepository.update(id, dto);
  }

  async addMember(groupId: number, member: User, caller: User): Promise<Group> {
    const group = await this.groupRepository.findOne(groupId);
    this.checkAbility(caller, Action.InviteMembers, group);

    group.members.push(member);
    return this.groupRepository.save(group);
  }

  async removeMember(
    groupId: number,
    memberId: number,
    caller: User,
  ): Promise<Group> {
    const group = await this.groupRepository.findOne(groupId);

    if (caller.id !== memberId) {
      this.checkAbility(caller, Action.RemoveMembers, group);
    } else {
      this.checkAbility(caller, Action.Read, group);
    }

    group.members = group.members.filter(({ id }) => id !== memberId);
    return this.groupRepository.save(group);
  }

  async remove(id: number, caller: User): Promise<DeleteResult> {
    const group = await this.groupRepository.findOne(id);
    this.checkAbility(caller, Action.Delete, group);

    return this.groupRepository.delete(id);
  }

  private checkAbility(user: User, action: Action, subject: Subjects): void {
    const ability = this.caslAbilityFactory.createForUser(user);
    ForbiddenError.from(ability).throwUnlessCan(action, subject);
  }
}
