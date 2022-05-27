import { Injectable } from '@nestjs/common';

import { SignalConnection } from '../types/signal-connection.type';
import { ServerSessionStore } from './server-session.store';

@Injectable()
export class SessionsStore {
  private readonly _connections = new Map<number, SignalConnection>();

  constructor(private readonly _serverSession: ServerSessionStore) {}

  getServerSession(): SignalConnection {
    return this._serverSession.getDataToSend();
  }

  addSession(id: number, connection: SignalConnection): SignalConnection {
    this._connections.set(id, connection);
    this._serverSession.createSession(connection);
    return this._serverSession.getDataToSend();
  }

  deleteSession(id: number): boolean {
    return this._connections.delete(id);
  }

  encryptMessage(receiverUserId: number, message: string): Promise<any> {
    const receiverConnection = this._connections.get(receiverUserId);
    if (!receiverConnection) throw new Error('Connection not found');

    const { userId, registrationId } = receiverConnection;

    return this._serverSession.encryptMessage(userId, registrationId, message);
  }

  decryptMessage(senderUserId: number, cipherText: any): Promise<string> {
    const senderConnection = this._connections.get(senderUserId);
    if (!senderConnection) throw new Error('Connection not found');

    const { userId, registrationId } = senderConnection;

    return this._serverSession.decryptMessage(
      userId,
      registrationId,
      cipherText,
    );
  }
}
