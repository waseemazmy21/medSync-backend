import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    recipient: string;
    title: string;
    message: string;
    titlerAr: string;
    messageAr: string;
}
