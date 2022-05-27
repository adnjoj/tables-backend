import { Injectable } from '@nestjs/common';

import { SignalConnection } from './types/signal-connection.type';
import { CreateSessionDto } from './dto/create-session.dto';

import { SessionsStore } from './stores/sessions.store';

@Injectable()
export class SignalSessionsService {
  constructor(private readonly sessionsStore: SessionsStore) {}

  createSession(dto: CreateSessionDto): SignalConnection {
    return this.sessionsStore.addSession(dto.userId, dto);
  }

  deleteSession(userId: number): boolean {
    return this.sessionsStore.deleteSession(userId);
  }

  getServerSession(): SignalConnection {
    return this.sessionsStore.getServerSession();
  }

  encryptMessage(receiverUserId: number, message: string): Promise<any> {
    return this.sessionsStore.encryptMessage(receiverUserId, message);
  }

  decryptMessage(senderUserId: number, cipherText: any): Promise<string> {
    return this.sessionsStore.decryptMessage(senderUserId, cipherText);
  }
}
