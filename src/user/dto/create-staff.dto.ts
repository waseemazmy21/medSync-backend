import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { ShiftDto } from './shift.dto';

export class CreateStaffDto extends CreateUserDto {
    @ApiProperty({
        description: 'MongoDB ObjectId of the department the staff belongs to',
        example: '64e3b6fcf3a2b91234567890',
    })
    @IsMongoId({ message: 'Department ID must be a valid MongoDB ObjectId.' })
    @IsNotEmpty({ message: 'Department ID is required.' })
    departmentId: string;

    @ApiProperty({
        description: 'Shift details for the staff member',
        type: ShiftDto,
    })
    @Type(() => ShiftDto)
    @IsNotEmpty({ message: 'Shift details are required.' })
    shift: ShiftDto;

    @ApiProperty({
        description: 'Job title in English',
        example: 'Receptionist',
        minLength: 3,
        maxLength: 30,
    })
    @IsString({ message: 'Job title must be a string.' })
    @Length(3, 30, { message: 'Job title must be between 3 and 30 characters.' })
    @IsNotEmpty({ message: 'Job title is required.' })
    jobTitle: string;

    @ApiProperty({
        description: 'Job title in Arabic',
        example: 'موظف استقبال',
        minLength: 3,
        maxLength: 30,
    })
    @IsString({ message: 'Job title (Arabic) must be a string.' })
    @Length(3, 30, { message: 'Job title (Arabic) must be between 3 and 30 characters.' })
    @IsNotEmpty({ message: 'Job title (Arabic) is required.' })
    jobTitleAr: string;
}
