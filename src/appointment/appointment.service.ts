import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/Appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DepartmentService } from 'src/department/department.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    private readonly departmentService: DepartmentService,
  ) { }

  async create(createAppointmentDto: CreateAppointmentDto, patientId: string): Promise<Appointment> {
    const doctorId = await this.departmentService.pickDoctor(createAppointmentDto.department)
    const appointmentData = {
      ...createAppointmentDto,
      patient: new Types.ObjectId(patientId),
      doctor: new Types.ObjectId(doctorId),
      department: new Types.ObjectId(createAppointmentDto.department),
      date: new Date(createAppointmentDto.date),
    };

    const createdAppointment = new this.appointmentModel(appointmentData);
    return createdAppointment.save();
  }

  async findAll(filter: any = {}, page = 1, limit = 10): Promise<{ data: Appointment[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.appointmentModel
        .find(filter)
        .populate('patient', 'name email phone')
        .populate('doctor', 'name email phone')
        .populate('department', 'name nameAr')
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.appointmentModel.countDocuments(filter),
    ]);
    return { data, total, page, limit };
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
}
