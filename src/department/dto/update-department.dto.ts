import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateDepartmentDto {
  @ApiProperty({ description: 'The updated name of the department', example: 'Cardiology', required: false })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  @MinLength(3)
  @MaxLength(50)
  name?: string;

  @ApiProperty({ description: 'The updated arabic name of the department', example: 'طب القلب', required: false })
  @IsOptional()
  @IsString({ message: 'Arabic name must be a string.' })
  @MinLength(3)
  @MaxLength(50)
  nameAr?: string;

  @ApiProperty({
    description: 'An updated brief description of the department',
    example: 'The cardiology department deals with disorders of the heart and blood vessels.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'An updated brief arabic description of the department',
    example: 'قسم القلب يتعامل مع اضطرابات القلب والأوعية الدموية.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Arabic description must be a string.' })
  @MaxLength(500)
  descriptionAr?: string;

  @ApiProperty({ description: 'The updated image of the department', example: 'new_image.jpg', required: false })
  @IsOptional()
  @IsString({ message: 'Image must be a string.' })
  image?: string;
}
