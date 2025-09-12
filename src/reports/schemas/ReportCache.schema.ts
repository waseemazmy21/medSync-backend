
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ReportCacheDocument = ReportCache & Document;

export class ReportData {
  @ApiProperty({ description: 'Overview summary of the department' })
  overview: string;

  @ApiProperty({ description: 'List of positive points', type: [String] })
  pros: string[];

  @ApiProperty({ description: 'List of negative points', type: [String] })
  cons: string[];

  @ApiProperty({ description: 'Average rating for the department' })
  averageRating: number;

  @ApiProperty({ description: 'Total number of reviews' })
  totalReviews: number;
}


@Schema({ timestamps: true })
export class ReportCache extends Document {
  @Prop({ required: false, type: String })
  department: string;

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

