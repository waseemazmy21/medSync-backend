import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department, DepartmentDocument } from './schemas/Department.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DepartmentService {
  constructor(@InjectModel(Department.name) private readonly departmentModel: Model<DepartmentDocument>) { }

  async create(createDepartmentDto: CreateDepartmentDto) {
    const existingDepartment = await this.departmentModel.findOne({
      $or: [
        { name: createDepartmentDto.name },
        { nameAr: createDepartmentDto.nameAr }
      ]
    });
    if (existingDepartment) {
      throw new ConflictException('Department with this name already exists');
    }
    const department = await this.departmentModel.create(createDepartmentDto);
    return department;
  }

  findAll(filter: any = {}) {
    return this.departmentModel.find(filter)
      .populate('staffCount')
      .populate('reviews')
      .populate('doctors')
      .exec();
  }

  async findOne(id: string) {
    const department = await this.departmentModel.findById(id).exec();
    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const updated = await this.departmentModel
      .findByIdAndUpdate(id, updateDepartmentDto, { new: true, runValidators: true })
      .exec();
    if (!updated) throw new NotFoundException('Department not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.departmentModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Department not found');
    return deleted;
  }

  // department.service.ts
  async pickDoctor(departmentId: string): Promise<string> {
    const department = await this.departmentModel
      .findById(departmentId)
      .populate('doctors')

    if (!department || department.get('doctors').length === 0) {
      throw new NotFoundException('No doctors available in this department');
    }

    const doctors = department.get('doctors');
    doctors.sort((a, b) => a.appointmentCount - b.appointmentCount);

    const selectedDoctor = doctors[0];

    await selectedDoctor.incrementAppointments();

    return selectedDoctor._id.toString();
  }

}
