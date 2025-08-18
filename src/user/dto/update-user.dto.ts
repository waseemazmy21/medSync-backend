import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsEnum, IsDateString } from 'class-validator';
import { BloodType, Gender } from 'src/common/types';

export class UpdateUserDto {
  @ApiProperty({ description: 'The updated name of the user', example: 'Johnathan Doe', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiProperty({ description: 'The updated phone number of the user', example: '01234567891', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'The updated gender of the user', enum: Gender, example: 'Male', required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ description: 'The updated birth date of the user', example: '1990-05-20', required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @ApiProperty({ description: 'The updated blood type of the user', enum: BloodType, example: 'O+', required: false })
  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType;
}
