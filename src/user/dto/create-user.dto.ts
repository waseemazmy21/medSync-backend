import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { RegexPatterns } from 'src/common/constants/regex';
import { Gender, UserRole } from 'src/common/types';

export class CreateUserDto {
    @ApiProperty({
        description: 'Full name of the user',
        example: 'Waseem Azmy',
        minLength: 3,
        maxLength: 50,
    })
    @ApiProperty({ description: 'The full name of the user', example: 'Jane Doe' })
    @IsString({ message: 'Name must be a string.' })
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters.' })
    @IsNotEmpty({ message: 'Name is required.' })
    name: string;

    @ApiProperty({
        description: 'Unique email address for the user',
        example: 'waseem@example.com',
    })
    @ApiProperty({ description: 'The email address of the user', example: 'jane.doe@example.com' })
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({ message: 'Email is required.' })
    email: string;

    @ApiProperty({
        description: 'Secure password (minimum 8 characters)',
        example: 'StrongPass123',
        minLength: 8,
    })
    @ApiProperty({ description: 'The password for the user account', example: 'Password123!', minLength: 8 })
    @IsString({ message: 'Password must be a string.' })
    @Length(8, 128, { message: 'Password must be at least 8 characters long.' })
    @IsNotEmpty({ message: 'Password is required.' })
    password: string;

    @ApiProperty({
        description: 'Unique phone number for the user',
        example: '+201557119734',
    })
    @ApiProperty({ description: 'The phone number of the user', example: '01234567890' })
    @IsString({ message: 'Phone must be a string.' })
    @Matches(RegexPatterns.PHONE, {
        message: 'Phone number must be valid Egyptian phone number (without country code).',
    })
    @IsNotEmpty({ message: 'Phone number is required.' })
    phone: string;

    @ApiProperty({
        description: 'Gender of the user',
        enum: Gender,
        example: Gender.Male,
    })
    @ApiProperty({ description: 'The gender of the user', enum: Gender, example: 'Female' })
    @IsEnum(Gender, { message: 'Gender must be either MALE or FEMALE.' })
    @IsNotEmpty({ message: 'Gender is required.' })
    gender: Gender;

    @ApiProperty({
        description: 'Role of the user in the system',
        enum: UserRole,
        example: UserRole.Doctor,
    })
    @IsEnum(UserRole, { message: 'Role must be one of the allowed values.' })
    @IsNotEmpty({ message: 'Role is required.' })
    role: UserRole;
}
