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
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Roles } from 'src/rbac/roles.decorator';
import { UserRole } from 'src/common/types';
import { RolesGuard } from 'src/rbac/roles.guard';

@UseGuards(RolesGuard)
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Roles(UserRole.Admin)
  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    try {
      const department = await this.departmentService.create(createDepartmentDto);
      return {
        success: true,
        message: 'Department created successfully',
        data: {
          department,
        }
      }
    } catch (error) {
      throw new HttpException(
        'Failed to create department',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles(UserRole.Admin, UserRole.DepartmentManager)
  @Get()
  async findAll(@Request() req: any) {
    try {
      // Department managers can only see their own department
      let filter = {};
      if (req.user.role === UserRole.DepartmentManager) {
        if (!req.user.departmentId) {
          throw new HttpException(
            'Department manager must be assigned to a department',
            HttpStatus.FORBIDDEN
          );
        }
        filter = { _id: req.user.departmentId };
      }
      
      const departments = await this.departmentService.findAll(filter);
      return {
        success: true,
        message: 'Departments retrieved successfully',
        data: {
          departments,
        }
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve departments',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles(UserRole.Admin, UserRole.DepartmentManager)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    try {
      const department = await this.departmentService.findOne(id);
      
      if (!department) {
        throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
      }

      // Department managers can only view their own department
      if (req.user.role === UserRole.DepartmentManager) {
        if (!req.user.departmentId || String(req.user.departmentId) !== id) {
          throw new HttpException(
            'You can only view your own department',
            HttpStatus.FORBIDDEN
          );
        }
      }

      return {
        success: true,
        message: 'Department retrieved successfully',
        data: {
          department,
        }
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve department',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles(UserRole.Admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    try {
      const department = await this.departmentService.findOne(id);
      
      if (!department) {
        throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
      }

      const updatedDepartment = await this.departmentService.update(id, updateDepartmentDto);
      return {
        success: true,
        message: 'Department updated successfully',
        data: {
          department: updatedDepartment,
        }
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update department',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles(UserRole.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const department = await this.departmentService.findOne(id);
      
      if (!department) {
        throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
      }

      const deletedDepartment = await this.departmentService.remove(id);
      return {
        success: true,
        message: 'Department deleted successfully',
        data: {
          department: deletedDepartment,
        }
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete department',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
