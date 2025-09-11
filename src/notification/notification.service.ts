import { Injectable, NotFoundException } from '@nestjs/common';
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
    const notification = new this.notificationModel({
      ...createNotificationDto,
      recipient: new Types.ObjectId(createNotificationDto.recipient),
    });
    const saved = await notification.save();

    this.notificationGateway.sendToUser(saved.recipient.toString(), saved)

    return saved;
  }

  async sendWelcomeNotification(userId: string) {
    return this.create({
      recipient: userId,
      title: "Welcome 🎉",
      message: "Thanks for registering! We're glad to have you onboard.",
      titlerAr: "🎉مرحبا",
      messageAr: "شكراً لتسجيلك! نحن سعداء بانضمامك إلينا."
    });
  }

  async findByUser(userId: string, page: number, limit: number) {
    const filter = { recipient: new Types.ObjectId(userId), hidden: false }

    const total = await this.notificationModel.countDocuments(filter)
    const unreadCount = await this.notificationModel.countDocuments({ ...filter, read: false, hidden: false })

    const notifications = await this.notificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec()

    return { notifications, total, page, limit, unreadCount }
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(notificationId), recipient: new Types.ObjectId(userId) },
      { read: true },
      { new: true },
    )

    if (!notification) {
      throw new NotFoundException('Notification not found')
    }

    return notification
  }

  async markAllAsRead(userId: string) {
    const result = await this.notificationModel.updateMany(
      { recipient: new Types.ObjectId(userId), read: false },
      { $set: { read: true } },
    )

    return { modifiedCount: result.modifiedCount }
  }

  async hideNotification(userId: string, notificationId: string) {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(notificationId), recipient: new Types.ObjectId(userId) },
      { hidden: true },
      { new: true },
    )
    if (!notification) {
      throw new NotFoundException('Notification not found')
    }
    return notification
  }

  async hideAll(userId: string) {
    const result = await this.notificationModel.updateMany(
      { recipient: new Types.ObjectId(userId), hidden: false },
      { $set: { hidden: true } },
    )

    return { modifiedCount: result.modifiedCount }
  }

}
