import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    patient: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
    department: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
    appointment: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    doctor: Types.ObjectId;

    @Prop({ type: Number, min: 0, max: 5, required: true })
    rating: number;

    @Prop({ type: String, required: true, minlength: 2, maxlength: 500 })
    feedback: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
