import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { DeleteResult, UpdateResult } from 'typeorm';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from '../casl/guards/abilities.guard';

import { CheckAbilities } from '../casl/decorators/check-abilities.decorator';
import { CreateGroupAbility } from './abilities/create-group.ability';

import { Group } from './entities/group.entity';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupIdDto } from './dto/group-id.dto';

import { GroupsService } from './groups.service';

@Controller('groups')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  findAll(@Req() { user }: Request): Promise<Group[]> {
    return this.groupsService.findAllForUser(user);
  }

  @Get(':groupId')
  findOne(
    @Req() { user }: Request,
    @Param() { groupId }: GroupIdDto,
  ): Promise<Group> {
    return this.groupsService.findOne({ id: groupId }, user);
  }

  @Post()
  @CheckAbilities(new CreateGroupAbility())
  create(
    @Req() { user }: Request,
    @Body() dto: CreateGroupDto,
  ): Promise<Group> {
    return this.groupsService.create({ ...dto, owner: user, members: [user] });
  }

  @Patch(':groupId')
  update(
    @Req() { user }: Request,
    @Param() { groupId }: GroupIdDto,
    @Body() dto: UpdateGroupDto,
  ): Promise<UpdateResult> {
    return this.groupsService.update(groupId, dto, user);
  }

  @Delete(':groupId')
  remove(
    @Req() { user }: Request,
    @Param() { groupId }: GroupIdDto,
  ): Promise<DeleteResult> {
    return this.groupsService.remove(groupId, user);
  }
}
