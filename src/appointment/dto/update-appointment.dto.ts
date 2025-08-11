import { IsDateString, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsOptional()
  @IsDateString()
  date?: string;

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
