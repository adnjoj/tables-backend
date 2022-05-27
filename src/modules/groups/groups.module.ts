import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import { Group } from './entities/group.entity';

import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { MembersController } from './members/members.controller';

import { GroupExistsRule } from './validation-rules/group-exists.validation-rule';
import { MemberExistsRule } from './validation-rules/member-exists.validation-rule';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), UsersModule],
  controllers: [GroupsController, MembersController],
  providers: [GroupsService, GroupExistsRule, MemberExistsRule],
  exports: [GroupsService],
})
export class GroupsModule {}
