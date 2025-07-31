import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './schemas/Department.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
  ) {}

  create(createDepartmentDto: CreateDepartmentDto) {
    const dept = new this.departmentModel(createDepartmentDto);
    dept.save();
    return {
      message: 'Department created successfully',
      data: dept,
    };
  }

  async findAll() {
    return this.departmentModel.find();
  }

  async findOne(id: number) {
    return this.departmentModel.findById(id);
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentModel.findByIdAndUpdate(id, updateDepartmentDto, {
      new: true,
    });
  }

  async remove(id: number) {
    return this.departmentModel.findByIdAndDelete(id);
  }
}
