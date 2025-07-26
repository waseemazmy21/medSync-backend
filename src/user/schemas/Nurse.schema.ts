import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./User.schema";

@Schema({ timestamps: true })
export class Nurse extends User {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    })
    departmentId: mongoose.Types.ObjectId;

    @Prop({
        required: true, type: {
            days: [String],
            startTime: String,
            endTime: String,
        }
    })
    shift: Shift;
}

export const NurseSchema = SchemaFactory.createForClass(Nurse);