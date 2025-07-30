import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department, DepartmentDocument } from './schemas/Department.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DepartmentService {

  constructor(@InjectModel(Department.name) private readonly departmentModel: Model<DepartmentDocument>) { }

  create(createDepartmentDto: CreateDepartmentDto) {
    const created = new this.departmentModel(createDepartmentDto);
    return created.save();
  }

  findAll() {
    return this.departmentModel.find().exec();
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
}
