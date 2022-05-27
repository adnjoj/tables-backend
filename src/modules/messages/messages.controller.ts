import { Controller, Get, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from '../casl/guards/abilities.guard';

import { Message } from './entities/message.entity';

import { SelectMessagesDto } from './dto/select-messages.dto';

import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll(
    @Req() { user }: Request,
    @Body() { interlocutorId, groupId, limit, offset }: SelectMessagesDto,
  ): Promise<Message[]> {
    if (interlocutorId) {
      return this.messagesService.findAllFromInterlocutor(
        interlocutorId,
        user,
        limit,
        offset,
      );
    } else {
      return this.messagesService.findAllFromGroup(
        groupId,
        user,
        limit,
        offset,
      );
    }
  }
}
