import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { NotificationGateway } from './notification.gateway';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService {

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private readonly notificationGateway: NotificationGateway,
  ) { }

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = new this.notificationModel(createNotificationDto);
    const saved = await notification.save();

    this.notificationGateway.server.emit(
      `notification_${saved.recipient}`,
      saved,
    );

    return saved;
  }
}
