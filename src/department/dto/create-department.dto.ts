import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class CreateDepartmentDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Arabic name is required' })
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
    nameAr: string;

    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    @Length(10, 255, { message: 'Description must be between 10 and 255 characters' })
    description: string;

    @IsString()
    @IsNotEmpty({ message: 'Arabic description is required' })
    @Length(10, 255, { message: 'Description must be between 10 and 255 characters' })
    descriptionAr: string;

    @IsOptional()
    @IsString()
    image?: string;
}
