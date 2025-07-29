import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './User.schema';

@Schema({ timestamps: true })
export class Staff extends User {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  })
  departmentId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: {
      days: [String],
      startTime: String,
      endTime: String,
    },
  })
  shift: Shift;

  @Prop({ required: true, minlength: 3, maxlength: 30 })
  jobTitle: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
