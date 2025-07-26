import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./User.schema";


@Schema({ timestamps: true })
export class Patient extends User {
    @Prop({ default: false })
    is_verified: boolean;

    @Prop({ required: true })
    birthDate: Date;

    @Prop({ enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] })
    bloodType: string;

    @Prop()
    allergies: string[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
