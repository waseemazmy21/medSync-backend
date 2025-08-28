import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ReportCacheDocument = ReportCache & Document;

@Schema({ timestamps: true })
export class ReportCache extends Document {
  @ApiProperty({
    description: "Type of report ('doctor', 'department', or 'complaints')",
    example: 'doctor',
    required: true,
  })
  @Prop({ required: true })
  type: string; // 'doctor' | 'department' | 'complaints'

  @ApiProperty({
    description: 'Doctor ID (if applicable)',
    example: '64e2b7c1f1a2b3c4d5e6f7a8',
    required: false,
  })
  @Prop({ required: false })
  doctorId?: string;

  @ApiProperty({
    description: 'Department ID (if applicable)',
    example: '64e2b7c1f1a2b3c4d5e6f7b9',
    required: false,
  })
  @Prop({ required: false })
  departmentId?: string;

  @ApiProperty({
    description: 'Start date for the report period (ISO 8601)',
    example: '2025-08-01T00:00:00.000Z',
    required: false,
  })
  @Prop({ required: false })
  from?: string;

  @ApiProperty({
    description: 'End date for the report period (ISO 8601)',
    example: '2025-08-28T23:59:59.999Z',
    required: false,
  })
  @Prop({ required: false })
  to?: string;

  @ApiProperty({
    description: 'The generated report data',
    required: true,
    type: Object,
  })
  @Prop({ required: true, type: Object })
  data: any;
}

export const ReportCacheSchema = SchemaFactory.createForClass(ReportCache);
