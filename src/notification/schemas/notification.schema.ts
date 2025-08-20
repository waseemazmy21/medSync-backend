import { NotFoundException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { User } from 'src/user/schemas/User.schema';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    recipient: User;

    @Prop({ required: true })
    title: string;

    @Prop()
    message?: string;

    @Prop({ default: false })
    read: boolean;

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ recipient: 1, createdAt: -1 });


NotificationSchema.pre('save', async function (next) {
    const recipient = await this.model('User').exists({ _id: this.recipient })
    if (!recipient) throw new NotFoundException('recipient not found')

    next()
})