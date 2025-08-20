import {
  WebSocketGateway,
  WebSocketServer,

  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './schemas/notification.schema';

@WebSocketGateway(80, {
  namespace: 'notification'
})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService
  ) { }

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(userId);
      console.log(`Client ${client.id} joined room ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendToUser(userId: string, notification: Notification) {
    this.server.to(userId).emit('notification', notification);
  }

}
