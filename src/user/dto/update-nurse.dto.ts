import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ShiftDto } from './shift.dto';

export class UpdateNurseDto {
  @ApiProperty({ description: 'The updated department ID for the nurse', example: '64e3b6fcf3a2b91234567891', required: false })
  @IsOptional()
  @IsMongoId()
  department?: string;

  @ApiProperty({ description: 'The updated shift details for the nurse', type: ShiftDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ShiftDto)
  shift?: ShiftDto;
}
