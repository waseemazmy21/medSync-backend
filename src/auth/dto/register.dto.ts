import {
    IsString,
    IsEmail,
    IsNotEmpty,
    Length,
    MinLength,
    Matches,
    IsEnum,
    IsOptional,
    IsArray,
    IsDateString,
} from 'class-validator';
import { RegexPatterns } from 'src/common/constants/regex';
import { BloodType, Gender } from 'src/common/types';
import { ApiProperty } from '@nestjs/swagger';

export class PatientRegisterDto {
    @ApiProperty({ description: 'The name of the patient', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    @Length(3, 30, { message: 'Name must be between 3 and 30 characters' })
    name: string;

    @ApiProperty({ description: 'The email address of the patient', example: 'john.doe@example.com' })
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @ApiProperty({ description: 'The password for the patient account', example: 'Password123!', minLength: 8 })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(RegexPatterns.PASSWORD, {
        message:
            'Password must contain at least one letter and one number',
    })
    password: string;

    @ApiProperty({ description: 'The phone number of the patient', example: '01234567890' })
    @IsString()
    @Matches(RegexPatterns.PHONE, {
        message: 'Phone number must be a valid Egyptian mobile number',
    })
    phone: string;

    @ApiProperty({ description: 'The gender of the patient', enum: Gender, example: 'Male' })
    @IsEnum(Gender, { message: `Gender must be one of: ${Object.values(Gender).join(', ')}` })
    gender: Gender;

    @ApiProperty({ description: 'The birth date of the patient', example: '2000-01-01', type: Date })
    @IsDateString({}, { message: 'Birth date must be a valid ISO date string (e.g., 2000-01-01)' })
    birthDate: Date;

    @ApiProperty({ description: 'The blood type of the patient', enum: BloodType, example: 'A+', required: false })
    @IsOptional()
    @IsEnum(BloodType, { message: `Blood type must be one of: ${Object.values(BloodType).join(', ')}` })
    bloodType?: BloodType;

    @ApiProperty({ description: 'The allergies of the patient', example: ['Allergy 1', 'Allergy 2'], required: false, type: [String] })
    @IsOptional()
    @IsArray({ message: 'Allergies must be an array' })
    @IsString({ each: true, message: 'Each allergy must be a string' })
    allergies?: string[];
}
