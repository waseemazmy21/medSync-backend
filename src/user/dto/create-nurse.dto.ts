import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { ShiftDto } from './shift.dto';

export class CreateNurseDto extends CreateUserDto {
    @ApiProperty({
        description: 'MongoDB ObjectId of the department the nurse belongs to',
        example: '64e3b6fcf3a2b91234567890',
    })
    @IsMongoId({ message: 'Department ID must be a valid MongoDB ObjectId.' })
    @IsNotEmpty({ message: 'Department ID is required.' })
    department: string;

    @ApiProperty({
        description: 'Shift details for the nurse',
        type: ShiftDto,
    })
    @Type(() => ShiftDto)
    @IsNotEmpty({ message: 'Shift details are required.' })
    shift: ShiftDto;
}
