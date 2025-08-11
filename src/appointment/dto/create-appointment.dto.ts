import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreatePrescriptionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  medicine: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  dose: string;
}

export class CreateAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsMongoId()
  @IsNotEmpty()
  doctor: string;

  @IsMongoId()
  @IsNotEmpty()
  department: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePrescriptionDto)
  prescription?: CreatePrescriptionDto;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;
}
