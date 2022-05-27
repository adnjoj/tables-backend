import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenError } from '@casl/ability';
import { Repository } from 'typeorm';

import { CaslAbilityFactory } from '../casl/factories/casl-ability.factory';

import { GroupsService } from '../groups/groups.service';
import { UsersService } from '../users/users.service';
import { SignalSessionsService } from '../signal-sessions/signal-sessions.service';

import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Action } from '../casl/enums/action.enum';

import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly signalSessionsService: SignalSessionsService,
  ) {}

  async findAllFromGroup(
    id: number,
    user: User,
    limit = 0,
    offset = 0,
  ): Promise<Message[]> {
    const group = await this.groupsService.findOne({ id });
    if (!group) return [];

    const ability = this.caslAbilityFactory.createForUser(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Read, group);

    return this.messageRepository.find({
      where: { receiverGroup: group },
      order: { id: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findAllFromInterlocutor(
    id: number,
    user: User,
    limit = 0,
    offset = 0,
  ): Promise<Message[]> {
    const interlocutor = await this.usersService.findOne({ id });
    if (!interlocutor) return [];

    return this.messageRepository.find({
      where: [
        { sender: user, receiverUser: interlocutor },
        { receiverUser: user, sender: interlocutor },
      ],
      order: { id: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  create(dto: CreateMessageDto): Promise<Message> {
    return this.messageRepository.save(dto);
  }

  encryptMessage(receiverUserId: number, message: string): Promise<any> {
    return this.signalSessionsService.encryptMessage(receiverUserId, message);
  }

  decryptMessage(senderUserId: number, cipherText: any): Promise<string> {
    return this.signalSessionsService.decryptMessage(senderUserId, cipherText);
  }
}
