import { NotFoundException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Appointment } from 'src/appointment/schemas/Appointment.schema';
import { Department } from 'src/department/schemas/Department.schema';
import { Doctor } from 'src/user/schemas/Doctor.schema';
import { Patient } from 'src/user/schemas/Patient.schema';

export type ReviewDocument = Review & Document

@Schema({ timestamps: true })
export class Review extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    patient: Patient;

    @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
    department: Department;

    @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
    appointment: Appointment;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    doctor: Doctor;

    @Prop({ type: Number, min: 0, max: 5, required: true })
    rating: number;

    @Prop({ type: String, maxlength: 500 })
    feedback: string;
}



export const ReviewSchema = SchemaFactory.createForClass(Review);


ReviewSchema.pre('save', async function (next) {
    const patientExists = await this.model('User').exists({ _id: this.patient });
    if (!patientExists) return next(new NotFoundException('Patient not found'));

    const departmentExists = await this.model('Department').exists({ _id: this.department });
    if (!departmentExists) return next(new NotFoundException('Department not found'));

    const appointmentExists = await this.model('Appointment').exists({ _id: this.appointment });
    if (!appointmentExists) return next(new NotFoundException('Appointment not found'));

    const doctorExists = await this.model('Doctor').exists({ _id: this.doctor });
    if (!doctorExists) return next(new NotFoundException('Doctor not found'));

    next();
});