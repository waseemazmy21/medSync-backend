
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Department } from 'src/department/schemas/Department.schema';

export type ReportCacheDocument = ReportCache & Document;

@Schema({ timestamps: true })
export class ReportCache extends Document {
  @Prop({ required: true, type: String })
  department: Department;

  @Prop({ required: false })
  from?: string;

  @Prop({ required: false })
  to?: string;

  @Prop({ required: true, type: String })
  overview: string;


  @Prop({ required: true, type: [String] })
  pros: string[];


  @Prop({ required: true, type: [String] })
  cons: string[];


  @Prop({ required: true, type: Number })
  averageRating: number;

  @Prop({ required: true, type: Number })
  totalReviews: number;
}

export const ReportCacheSchema = SchemaFactory.createForClass(ReportCache);

