import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    recipient: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop()
    message?: string;

    @Prop({ type: Object, default: {} })
    payload?: any;

    @Prop({ default: false })
    read: boolean;

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ recipient: 1, createdAt: -1 });
