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
import { ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

@UseGuards(RolesGuard)
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Create department' })
  @ApiResponse({ status: 201, description: 'Department created successfully', schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      data: {
        type: 'object',
        properties: {
          department: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              image: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  } })
  @ApiResponse({ status: 400, description: 'Bad Request', schema: { type: 'object', properties: { statusCode: { type: 'number' }, message: { type: 'string' }, error: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized', schema: { type: 'object', properties: { statusCode: { type: 'number', example: 401 }, message: { type: 'string', example: 'Unauthorized' } } } })
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

  @Get()
  @Roles(UserRole.Admin, UserRole.Doctor)
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({ status: 200, description: 'List retrieved successfully', schema: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  } })
  @ApiResponse({ status: 400, description: 'Bad Request', schema: { type: 'object', properties: { statusCode: { type: 'number' }, message: { type: 'string' }, error: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized', schema: { type: 'object', properties: { statusCode: { type: 'number', example: 401 }, message: { type: 'string', example: 'Unauthorized' } } } })
  async findAll(@Request() req: any) {
    const departments = await this.departmentService.findAll();
    return {
      success: true,
      message: 'Departments retrieved successfully',
      data: {
        departments,
      }
    }
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.Doctor)
  @ApiOperation({ summary: 'Get department by id' })
  @ApiResponse({ status: 200, description: 'Entity retrieved successfully', schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
      image: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  } })
  @ApiResponse({ status: 400, description: 'Bad Request', schema: { type: 'object', properties: { statusCode: { type: 'number' }, message: { type: 'string' }, error: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized', schema: { type: 'object', properties: { statusCode: { type: 'number', example: 401 }, message: { type: 'string', example: 'Unauthorized' } } } })
  async findOne(@Param('id') id: string, @Request() req: any) {
    try {
      const department = await this.departmentService.findOne(id);

      if (!department) {
        throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
      }

      // Department managers can only view their own department
      if (req.user.role === UserRole.Doctor) {
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

  @Patch(':id')
  @Roles(UserRole.Admin)
  @ApiResponse({
    status: 200,
    description: 'Operation successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Operation completed successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        }
      }
    }
  })
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

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiResponse({
    status: 200,
    description: 'Operation successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Operation completed successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        }
      }
    }
  })
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
