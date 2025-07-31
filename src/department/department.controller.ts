import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/rbac/roles.decorator';
import { UserRole } from 'src/common/types';
import { RolesGuard } from 'src/rbac/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const department = await this.departmentService.create(createDepartmentDto);
    return {
      sucess: true,
      message: 'Department created successfully',
      data: {
        department,
      }
    }
  }

  @Get()
  async findAll() {
    const departments = await this.departmentService.findAll();
    return {
      sucess: true,
      message: 'Departments retrieved successfully',
      data: {
        departments,
      }
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const department = await this.departmentService.findOne(id);
    return {
      sucess: true,
      message: 'Department retrieved successfully',
      data: {
        department,
      }
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    const department = this.departmentService.update(id, updateDepartmentDto);
    return {
      sucess: true,
      message: 'Department updated successfully',
      data: {
        department,
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const department = this.departmentService.remove(id);
    return {
      sucess: true,
      message: 'Department deleted successfully',
      data: {
        department,
      }
    }
  }
}
