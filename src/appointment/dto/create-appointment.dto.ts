import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreatePrescriptionDto {
  @ApiProperty({
    description: 'The name of the prescribed medicine',
    example: 'Panadol',
  })
  @IsString({ message: 'Medicine must be a string.' })
  @IsNotEmpty({ message: 'Medicine is required.' })
  @MinLength(2)
  @MaxLength(100)
  medicine: string;

  @ApiProperty({ description: 'The dosage of the medicine', example: '500mg' })
  @IsString({ message: 'Dose must be a string.' })
  @IsNotEmpty({ message: 'Dose is required.' })
  @MinLength(2)
  @MaxLength(50)
  dose: string;
}

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'The date of the appointment',
    example: '2025-09-15T14:30:00.000Z',
  })
  @IsDateString({}, { message: 'Date must be a valid date string.' })
  @IsNotEmpty({ message: 'Date is required.' })
  date: string;

  // ...doctor property removed...

  @ApiProperty({
    description: 'The ID of the department for the appointment',
    example: '60d5ecb8b4850b3e8c8e8e8f',
  })
  @IsMongoId({ message: 'Department must be a valid Mongo ID.' })
  @IsNotEmpty({ message: 'Department is required.' })
  department: string;

  @ApiProperty({
    description: 'Optional notes for the appointment',
    example: 'Patient is complaining of a persistent cough.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string.' })
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    description: 'Optional prescription for the appointment',
    type: () => CreatePrescriptionDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePrescriptionDto)
  prescription?: CreatePrescriptionDto;

  @ApiProperty({
    description: 'Optional follow-up date for the appointment',
    example: '2025-09-22T14:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Follow-up date must be a valid date string.' })
  followUpDate?: string;
}
