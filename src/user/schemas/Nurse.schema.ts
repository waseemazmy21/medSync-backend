import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "./User.schema";
import { Shift } from "src/common/types";
import { Department } from "src/department/schemas/Department.schema";

export type NurseDocument = Nurse & Document;

@Schema({ timestamps: true })
export class Nurse extends User {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    })
    department: Department;

    @Prop({
        required: true,
        type: {
            days: [Number],
            startTime: String,
            endTime: String,
        }
    })
    shift: Shift;
}

export const NurseSchema = SchemaFactory.createForClass(Nurse);