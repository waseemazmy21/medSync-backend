import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema, Notification } from './schemas/notification.schema';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema }
    ]),
  ],
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService],
  controllers: [NotificationController]
})
export class NotificationModule { }
