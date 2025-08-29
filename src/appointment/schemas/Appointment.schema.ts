import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AppointmentStatus } from 'src/common/types';

export type AppointmentDocument = Appointment & Document;

@Schema()
export class Prescription {
  @Prop({ required: true, minlength: 2, maxlength: 100 })
  medicine: string;

  @Prop({ required: true, minlength: 2, maxlength: 50 })
  dose: string;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  department: Types.ObjectId;

  @Prop({ maxlength: 500 })
  notes: string;

  @Prop({ type: PrescriptionSchema })
  prescription: Prescription;

  @Prop()
  followUpDate: Date;

  @Prop({ default: AppointmentStatus.SCHEDULED, enum: AppointmentStatus })
  status: AppointmentStatus;
}
export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
