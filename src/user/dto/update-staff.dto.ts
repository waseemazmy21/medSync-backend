import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ShiftDto } from './shift.dto';

export class UpdateStaffDto {
  @ApiProperty({ description: 'The updated position of the staff member', example: 'Receptionist', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @ApiProperty({ description: 'The updated shift details for the staff member', type: ShiftDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ShiftDto)
  shift?: ShiftDto;
}
