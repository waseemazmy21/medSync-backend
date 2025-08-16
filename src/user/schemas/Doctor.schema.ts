import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "./User.schema";
import { Shift } from "src/common/types";
import { Department } from "src/department/schemas/Department.schema";

export type DoctorDocument = Doctor & Document;
@Schema()
export class Doctor extends User {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    })
    department: Department;

    @Prop({ type: String, required: true })
    specialization: string;

    @Prop({ type: String, required: true })
    specializationAr: string;

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



export const DoctorSchema = SchemaFactory.createForClass(Doctor);

DoctorSchema.virtual("appointmentCount", {
    ref: "Appointment",
    localField: "_id",
    foreignField: "doctorId",
    count: true // only returns the count
});