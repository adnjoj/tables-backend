import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from 'src/modules/casl/guards/abilities.guard';

import { Group } from '../entities/group.entity';
import { User } from 'src/modules/users/entities/user.entity';

import { GroupIdDto } from '../dto/group-id.dto';
import { GroupMemberIdDto } from '../dto/group-member-id.dto';
import { AddMemberDto } from '../dto/add-member.dto';

import { GroupsService } from '../groups.service';
import { UsersService } from 'src/modules/users/users.service';

@Controller('groups/:groupId/members')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
export class MembersController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll(
    @Req() { user }: Request,
    @Param() { groupId }: GroupIdDto,
  ): Promise<User[]> {
    return this.groupsService.findGroupMembers({ id: groupId }, user);
  }

  @Get(':memberId')
  findOne(@Param() { memberId }: GroupMemberIdDto): Promise<User> {
    return this.usersService.findOne({ id: memberId });
  }

  @Post('')
  add(
    @Req() { user }: Request,
    @Param() { groupId }: GroupIdDto,
    @Body() dto: AddMemberDto,
  ): Promise<Group> {
    return this.groupsService.addMember(groupId, dto.user, user);
  }

  @Delete(':memberId')
  remove(
    @Req() { user }: Request,
    @Param() { groupId, memberId }: GroupMemberIdDto,
  ): Promise<Group> {
    return this.groupsService.removeMember(groupId, memberId, user);
  }
}
