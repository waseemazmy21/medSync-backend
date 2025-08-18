import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
    @ApiProperty({ description: 'The name of the department', example: 'Cardiology' })
    @IsString({ message: 'Name must be a string.' })
    @IsNotEmpty({ message: 'Name is required' })
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
    name: string;

    @ApiProperty({ description: 'The arabic name of the department', example: 'Cardiology' })
    @IsString({ message: 'Arabic name must be a string.' })
    @IsNotEmpty({ message: 'Arabic name is required' })
    @Length(3, 50, { message: 'Arabic name must be between 3 and 50 characters' })
    nameAr: string;

    @ApiProperty({
        description: 'A brief description of the department',
        example: 'The cardiology department deals with disorders of the heart.',
    })
    @IsString({ message: 'Description must be a string.' })
    @IsNotEmpty({ message: 'Description is required' })
    @Length(10, 255, { message: 'Description must be between 10 and 255 characters' })
    description: string;

    @ApiProperty({
        description: 'A brief arabic description of the department',
        example: 'The cardiology department deals with disorders of the heart.',
    })
    @IsString({ message: 'Arabic description must be a string.' })
    @IsNotEmpty({ message: 'Arabic description is required' })
    @Length(10, 255, { message: 'Arabic description must be between 10 and 255 characters' })
    descriptionAr: string;

    @ApiProperty({
        description: 'The image of the department',
        example: 'image.jpg',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Image must be a string.' })
    image?: string;
}
