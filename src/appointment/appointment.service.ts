import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/Appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, patientId: string): Promise<Appointment> {
    const appointmentData = {
      ...createAppointmentDto,
      patient: new Types.ObjectId(patientId),
      doctor: new Types.ObjectId(createAppointmentDto.doctor),
      department: new Types.ObjectId(createAppointmentDto.department),
      date: new Date(createAppointmentDto.date),
      followUpDate: createAppointmentDto.followUpDate ? new Date(createAppointmentDto.followUpDate) : undefined,
    };

    const createdAppointment = new this.appointmentModel(appointmentData);
    return createdAppointment.save();
  }

  async findAll(filter: any = {}): Promise<Appointment[]> {
    return this.appointmentModel
      .find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('department', 'name nameAr')
      .sort({ date: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid appointment ID');
    }

    const appointment = await this.appointmentModel
      .findById(id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('department', 'name nameAr')
      .exec();

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid appointment ID');
    }

    const updateData: any = { ...updateAppointmentDto };
    
    if (updateAppointmentDto.date) {
      updateData.date = new Date(updateAppointmentDto.date);
    }
    
    if (updateAppointmentDto.followUpDate) {
      updateData.followUpDate = new Date(updateAppointmentDto.followUpDate);
    }

    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('department', 'name nameAr')
      .exec();

    if (!updatedAppointment) {
      throw new NotFoundException('Appointment not found');
    }

    return updatedAppointment;
  }

  async remove(id: string): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid appointment ID');
    }

    const deletedAppointment = await this.appointmentModel
      .findByIdAndDelete(id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('department', 'name nameAr')
      .exec();

    if (!deletedAppointment) {
      throw new NotFoundException('Appointment not found');
    }

    return deletedAppointment;
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    return this.findAll({ patient: new Types.ObjectId(patientId) });
  }

  async findByDoctor(doctorId: string): Promise<Appointment[]> {
    return this.findAll({ doctor: new Types.ObjectId(doctorId) });
  }

  async findByDepartment(departmentId: string): Promise<Appointment[]> {
    return this.findAll({ department: new Types.ObjectId(departmentId) });
  }
}
