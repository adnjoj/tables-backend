import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ForbiddenError } from '@casl/ability';
import { Socket } from 'socket.io';

import { WebsocketsJwtAuthGuard } from './guards/websockets-jwt-auth.guard';

import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Group } from '../groups/entities/group.entity';
import { Action } from '../casl/enums/action.enum';

import { CaslAbilityFactory } from '../casl/factories/casl-ability.factory';
import { GatewayConnectionsStore } from './stores/gateway-connections.store';

import { MessagesService } from './messages.service';
import { GroupsService } from '../groups/groups.service';

@WebSocketGateway(3001, { cors: true })
@UseGuards(WebsocketsJwtAuthGuard)
export class MessagesGateway {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly groupsService: GroupsService,
    private readonly gatewayConnectionsStore: GatewayConnectionsStore,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const sender = client.data.user;
    this.gatewayConnectionsStore.addConnection(sender.id, client);

    if (data.isInitial) return;

    const text = await this.messagesService.decryptMessage(
      sender.id,
      data.cipherTextMessage,
    );

    if (data.receiverUserId) {
      const receiver = { id: data.receiverUserId as number };
      const dto = { text, sender, receiverUser: receiver };
      const message = await this.messagesService.create(dto);

      this.handlePersonalMessage(message, sender, receiver);
    } else if (data.receiverGroupId) {
      const receiver = { id: data.receiverGroupId as number };
      const dto = { text, sender, receiverGroup: receiver };
      const message = await this.messagesService.create(dto);

      this.handleGroupMessage(message, sender, receiver);
    }
  }

  private async sendMessage(
    { text, ...message }: Message,
    receiver: Pick<User, 'id'>,
  ): Promise<void> {
    try {
      const cipherTextMessage = await this.messagesService.encryptMessage(
        receiver.id,
        text,
      );

      this.gatewayConnectionsStore.getConnection(receiver.id)?.emit('message', {
        ...message,
        cipherTextMessage,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  private async handlePersonalMessage(
    message: Message,
    sender: Pick<User, 'id'>,
    receiver: Pick<User, 'id'>,
  ): Promise<void> {
    this.sendMessage(message, receiver);
    this.sendMessage(message, sender);
  }

  private async handleGroupMessage(
    message: Message,
    sender: User,
    receiver: Pick<Group, 'id'>,
  ): Promise<void> {
    const group = await this.groupsService.findOne(receiver);
    if (!group) return;

    const ability = this.caslAbilityFactory.createForUser(sender);
    ForbiddenError.from(ability).throwUnlessCan(Action.Read, group);

    group.members.forEach((member) => {
      this.sendMessage(message, member);
    });
  }
}
