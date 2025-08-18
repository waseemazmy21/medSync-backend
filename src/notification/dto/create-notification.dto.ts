import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: 'The ID of the user receiving the notification', example: '60d5ecb8b4850b3e8c8e8e8e' })
  @IsMongoId()
  @IsNotEmpty()
  user: string; // Assuming user is a reference by ID

  @ApiProperty({ description: 'The title of the notification', example: 'Appointment Reminder' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'The main content of the notification', example: 'Your appointment is tomorrow at 10:00 AM.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;
}
