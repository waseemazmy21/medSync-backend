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

export class PatientRegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30, { message: 'Name must be between 3 and 30 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(RegexPatterns.PASSWORD, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsString()
  @Matches(RegexPatterns.PHONE, {
    message: 'Phone number must be a valid Egyptian mobile number',
  })
  phone: string;

  @IsEnum(Gender, {
    message: `Gender must be one of: ${Object.values(Gender).join(', ')}`,
  })
  gender: Gender;

  @IsDateString(
    {},
    {
      message: 'Birth date must be a valid ISO date string (e.g., 2000-01-01)',
    },
  )
  birthDate: Date;

  @IsOptional()
  @IsEnum(BloodType, {
    message: `Blood type must be one of: ${Object.values(BloodType).join(', ')}`,
  })
  bloodType?: BloodType;

  @IsOptional()
  @IsArray({ message: 'Allergies must be an array' })
  @IsString({ each: true, message: 'Each allergy must be a string' })
  allergies?: string[];
}
