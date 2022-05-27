import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GatewayConnectionsStore {
  private readonly _connections = new Map<number, Socket>();

  getConnection(id: number): Socket {
    return this._connections.get(id);
  }

  addConnection(id: number, socket: Socket): Socket {
    this._connections.set(id, socket);
    return socket;
  }

  deleteConnection(id: number): boolean {
    return this._connections.delete(id);
  }
}
