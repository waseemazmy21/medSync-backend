import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./User.schema";
import { Document } from "mongoose";
import { BloodType } from "src/common/types";

export type PatientDocument = Patient & Document;

@Schema()
export class Patient extends User {
    @Prop({ default: false })
    is_verified: boolean;

    @Prop({ required: true })
    birthDate: Date;

    @Prop({ enum: BloodType })
    bloodType: BloodType;

    @Prop({ default: [] })
    allergies: string[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
