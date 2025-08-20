import { IsDateString, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePrescriptionDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  medicine?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  dose?: string;
}

export class UpdateAppointmentByDoctorDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePrescriptionDto)
  prescription?: UpdatePrescriptionDto;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;
}

export class UpdateAppointmentByPatientDto {
  @IsOptional()
  @IsDateString()
  date?: string;
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
