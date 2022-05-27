import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { GroupsModule } from '../groups/groups.module';
import { SignalSessionsModule } from '../signal-sessions/signal-sessions.module';

import { Message } from './entities/message.entity';

import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { GatewayConnectionsStore } from './stores/gateway-connections.store';
import { WebsocketsJwtAuthGuard } from './guards/websockets-jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    SignalSessionsModule,
    GroupsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesGateway,
    GatewayConnectionsStore,
    WebsocketsJwtAuthGuard,
  ],
})
export class MessagesModule {}
