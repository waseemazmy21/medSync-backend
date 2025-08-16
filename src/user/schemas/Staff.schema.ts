import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "./User.schema";
import { Shift } from "src/common/types";
import { Department } from "src/department/schemas/Department.schema";

export type StaffDocument = Staff & Document;

@Schema({ timestamps: true })
export class Staff extends User {
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

    @Prop({ required: true, minlength: 3, maxlength: 30 })
    jobTitle: string;

    @Prop({ required: true, minlength: 3, maxlength: 30 })
    jobTitleAr: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
