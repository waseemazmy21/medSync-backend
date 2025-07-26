import {
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Max,
    Min,
} from 'class-validator';

export class CreateDepartmentDto {
    @IsString()
    name: string;

    @IsString()
    @Length(10, 100)
    description: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    averageRating?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    numberOfReviews?: number;
}
