import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./User.schema";

@Schema()
export class Doctor extends User {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    })
    departmentId: mongoose.Types.ObjectId;

    @Prop({ type: String, required: true })
    specialization: string;

    @Prop({
        required: true, type: {
            days: [String],
            startTime: String,
            endTime: String,
        }
    })
    shift: Shift;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);