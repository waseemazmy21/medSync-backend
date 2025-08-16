import { ApiProperty } from '@nestjs/swagger';
import {
    IsMongoId,
    IsNotEmpty,
    IsString,
    Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { ShiftDto } from './shift.dto';

export class CreateDoctorDto extends CreateUserDto {
    @ApiProperty({
        description: 'MongoDB ObjectId of the department the doctor belongs to',
        example: '64e3b6fcf3a2b91234567890',
    })
    @IsMongoId({ message: 'Department ID must be a valid MongoDB ObjectId.' })
    @IsNotEmpty({ message: 'Department ID is required.' })
    department: string;

    @ApiProperty({
        description: 'Specialization in English',
        example: 'Cardiology',
        minLength: 2,
        maxLength: 100,
    })
    @IsString({ message: 'Specialization must be a string.' })
    @Length(2, 100, { message: 'Specialization must be between 2 and 100 characters.' })
    @IsNotEmpty({ message: 'Specialization is required.' })
    specialization: string;

    @ApiProperty({
        description: 'Specialization in Arabic',
        example: 'طب القلب',
        minLength: 2,
        maxLength: 100,
    })
    @IsString({ message: 'Specialization (Arabic) must be a string.' })
    @Length(2, 100, { message: 'Specialization (Arabic) must be between 2 and 100 characters.' })
    @IsNotEmpty({ message: 'Specialization (Arabic) is required.' })
    specializationAr: string;

    @ApiProperty({
        description: 'Doctor shift details',
        type: ShiftDto,
    })
    @Type(() => ShiftDto)
    @IsNotEmpty({ message: 'Shift details are required.' })
    shift: ShiftDto;
}
