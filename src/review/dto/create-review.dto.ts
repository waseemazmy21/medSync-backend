import { IsMongoId, IsNotEmpty, IsNumber, IsString, Max, Min, Length } from 'class-validator';

export class CreateReviewDto {
    @IsMongoId({ message: 'Invalid patient ID format' })
    @IsNotEmpty({ message: 'Patient ID is required' })
    patient: string;

    @IsMongoId({ message: 'Invalid department ID format' })
    @IsNotEmpty({ message: 'Department ID is required' })
    department: string;

    @IsMongoId({ message: 'Invalid appointment ID format' })
    @IsNotEmpty({ message: 'Appointment ID is required' })
    appointment: string;

    @IsMongoId({ message: 'Invalid doctor ID format' })
    @IsNotEmpty({ message: 'Doctor ID is required' })
    doctor: string;

    @IsNumber({}, { message: 'Rating must be a number' })
    @Min(0, { message: 'Rating cannot be less than 0' })
    @Max(5, { message: 'Rating cannot be more than 5' })
    rating: number;

    @IsString({ message: 'Feedback must be a string' })
    @IsNotEmpty({ message: 'Feedback is required' })
    @Length(2, 500, { message: 'Feedback must be between 5 and 500 characters' })
    feedback: string;
}
