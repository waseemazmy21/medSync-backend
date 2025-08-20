import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { NotificationGateway } from './notification.gateway';
import { Model, Types } from 'mongoose';

@Injectable()
export class NotificationService {

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private readonly notificationGateway: NotificationGateway,
  ) { }

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = new this.notificationModel(createNotificationDto);
    const saved = await notification.save();

    this.notificationGateway.sendToUser(saved.recipient.toString(), saved)

    return saved;
  }

  async sendWelcomeNotification(userId: string) {
    return this.create({
      recipient: userId,
      title: "Welcome 🎉",
      message: "Thanks for registering! We're glad to have you onboard."
    });
  }

  async findByUser(userId: string): Promise<Notification[]> {
    const query = { recipient: new Types.ObjectId(userId) };
    const notifications = await this.notificationModel.find(query).sort({ createdAt: -1 }).exec()
    return notifications
  }
}
