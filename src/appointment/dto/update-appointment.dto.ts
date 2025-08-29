import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from 'src/common/types';

// Add OpenAPI schemas for frontend codegen
export const UpdateAppointmentByDoctorDtoOpenAPISchema = {
  type: 'object',
  properties: {
    status: { type: AppointmentStatus, enum: AppointmentStatus },
    notes: { type: 'string' },
    prescription: { $ref: '#/components/schemas/CreatePrescriptionDto' },
    followUpDate: { type: 'string' },
  },
};

export const UpdateAppointmentByPatientDtoOpenAPISchema = {
  type: 'object',
  properties: {
    date: { type: 'string' },
    notes: { type: 'string' },
  },
};


export class UpdatePrescriptionDto {
  @ApiProperty({
    description: 'The name of the prescribed medicine',
    example: 'Panadol',
    required: false,
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  medicine?: string;

  @ApiProperty({
    description: 'The dosage of the medicine',
    example: '500mg',
    required: false,
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  dose?: string;
}

export class UpdateAppointmentByDoctorDto {
  @ApiProperty({
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: AppointmentStatus;

  @ApiProperty({
    description: 'Doctor notes for the appointment',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    description: 'Prescription details',
    type: () => UpdatePrescriptionDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePrescriptionDto)
  prescription?: UpdatePrescriptionDto;

  @ApiProperty({
    description: 'Follow-up date for the appointment',
    example: '2025-09-29T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  followUpDate?: string;
}

export class UpdateAppointmentByPatientDto {
  @ApiProperty({
    description: 'The new date for the appointment',
    example: '2025-09-16T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    description: 'Notes for the appointment',
    example: 'Patient requested to reschedule.',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateAppointmentDto {
  @ApiProperty({
    description: 'The updated date of the appointment',
    example: '2025-09-16T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date must be a valid date string.' })
  date?: string;

  @ApiProperty({
    description: 'Updated notes for the appointment',
    example: 'Prescribed antibiotics for the cough.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string.' })
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    description: 'Updated prescription for the appointment',
    type: () => UpdatePrescriptionDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePrescriptionDto)
  prescription?: UpdatePrescriptionDto;

  @ApiProperty({
    description: 'Updated follow-up date for the appointment',
    example: '2025-09-29T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Follow-up date must be a valid date string.' })
  followUpDate?: string;
}
