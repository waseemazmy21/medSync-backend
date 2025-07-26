import { Inject, Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './schemas/Department.schema';
import { Model, model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DepartmentService {

  constructor(@InjectModel(Department.name) private readonly departmentModel: Model<Department>) { }

  create(createDepartmentDto: CreateDepartmentDto) {
    const dept = new this.departmentModel(createDepartmentDto);
    dept.save();
    return {
      message: 'Department created successfully',
      data: dept,
    };
  }

  findAll() {
    return `This action returns all department`;
  }

  findOne(id: number) {
    return `This action returns a #${id} department`;
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  remove(id: number) {
    return `This action removes a #${id} department`;
  }
}
