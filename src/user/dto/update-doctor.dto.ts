import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ShiftDto } from './shift.dto';

export class UpdateDoctorDto {
  @ApiProperty({ description: 'The updated specialty of the doctor', example: 'General Surgery', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialization?: string;

  @ApiProperty({ description: 'The updated specialty in Arabic', example: 'الجراحة العامة', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specializationAr?: string;

  @ApiProperty({ description: 'The updated department ID for the doctor', example: '64e3b6fcf3a2b91234567891', required: false })
  @IsOptional()
  @IsMongoId()
  department?: string;

  @ApiProperty({ description: 'The updated shift details for the doctor', type: ShiftDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ShiftDto)
  shift?: ShiftDto;
}
