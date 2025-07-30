import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class CreateDepartmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @Length(10, 100)
    description: string;

    @IsOptional()
    @IsString()
    image?: string;
}
