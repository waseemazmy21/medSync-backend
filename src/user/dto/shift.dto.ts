import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsInt, Min, Max, IsString,IsNotEmpty } from 'class-validator';

export class ShiftDto {
    @ApiProperty({
        description: 'Days of the week the shift applies to (0=Saturday, 1=Sunday, ..., 6=Friday, 7=Holiday)',
        example: [0, 1, 3, 4],
        type: [Number],
    })
    @IsArray({ message: 'Days must be an array of numbers.' })
    @ArrayNotEmpty({ message: 'Days array cannot be empty.' })
    @IsInt({ each: true, message: 'Each day must be an integer between 0 and 6.' })
    @Min(0, { each: true, message: 'Day must be between 0 and 6.' })
    @Max(7, { each: true, message: 'Day must be between 0 and 6.' })
    day: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];

    @ApiProperty({
        description: 'Start time of the shift in HH:mm format',
        example: '09:00',
    })
    startTime: string;

    @ApiProperty({
        description: 'End time of the shift in HH:mm format',
        example: '17:00',
    })
    @ApiProperty({ description: 'End time of the shift in HH:mm format' })
    @IsString()
    @IsNotEmpty()
    endTime: string;
}
