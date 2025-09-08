import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsString, Max, Min, Length } from 'class-validator';

export class CreateReviewDto {
    @ApiProperty({
        description: 'ID of the patient',
        example: '64f1c5d2a1b2c3456789abcd',
    })
    @IsMongoId({ message: 'Invalid patient ID format' })
    @IsNotEmpty({ message: 'Patient ID is required' })
    patient: string;

    @ApiProperty({
        description: 'ID of the department',
        example: '64f1c5d2a1b2c3456789abcf',
    })
    @IsMongoId({ message: 'Invalid department ID format' })
    @IsNotEmpty({ message: 'Department ID is required' })
    department: string;

    @ApiProperty({
        description: 'ID of the appointment',
        example: '64f1c5d2a1b2c3456789abde',
    })
    @IsMongoId({ message: 'Invalid appointment ID format' })
    @IsNotEmpty({ message: 'Appointment ID is required' })
    appointment: string;

    @ApiProperty({
        description: 'ID of the doctor',
        example: '64f1c5d2a1b2c3456789abdc',
    })
    @IsMongoId({ message: 'Invalid doctor ID format' })
    @IsNotEmpty({ message: 'Doctor ID is required' })
    doctor: string;

    @ApiProperty({
        description: 'Rating given to the doctor (0-5)',
        minimum: 0,
        maximum: 5,
        example: 4,
    })
    @IsNumber({}, { message: 'Rating must be a number' })
    @Min(0, { message: 'Rating cannot be less than 0' })
    @Max(5, { message: 'Rating cannot be more than 5' })
    rating: number;

    @ApiProperty({
        description: 'Feedback from the patient about the doctor/appointment',
        maxLength: 500,
        example: 'Feedback text',
    })
    @IsString({ message: 'Feedback must be a string' })
    @IsNotEmpty({ message: 'Feedback is required' })
    @Length(0, 500, { message: 'Feedback must be between 5 and 500 characters' })
    feedback: string;
}
