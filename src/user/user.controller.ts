import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  Param,
  Delete,

} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from 'src/common/types';
import { Roles } from 'src/rbac/roles.decorator';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CreateNurseDto } from './dto/create-nurse.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { UpdateNurseDto } from './dto/update-nurse.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

// @UseGuards(RolesGuard, UseGuards)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Roles(UserRole.Admin)
  @Post('doctor')
  @ApiOperation({ summary: 'Create a doctor (admin only)' })
  @ApiResponse({
    status: 201,
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
  async createDoctor(@Body() dto: CreateDoctorDto) {
    const user = await this.userService.createDoctor(dto);
    return {
      success: true,
      message: "Doctor created successfully",
      data: { user }
    }
  }

  @Roles(UserRole.Admin)
  @Post('nurse')
  @ApiOperation({ summary: 'Create a nurse (admin only)' })
  @ApiResponse({
    status: 201,
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
  async createNurse(@Body() dto: CreateNurseDto) {
    const user = await this.userService.createNurse(dto);
    return {
      success: true,
      message: "Nurse created successfully",
      data: user,
    };
  }

  @Roles(UserRole.Admin)
  @Post('staff')
  @ApiOperation({ summary: 'Create a staff member (admin only)' })
  @ApiResponse({
    status: 201,
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
  async createStaff(@Body() dto: CreateStaffDto) {
    const user = await this.userService.createStaff(dto);
    return {
      success: true,
      message: "Staff member created successfully",
      data: user,
    };
  }


  @Roles(UserRole.Admin)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              department: { type: 'string' },
              phone: { type: 'string' },
              gender: { type: 'string' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'department', required: false, type: String, example: '64f1c8a2b9d3e45f7a123456' })
  @ApiQuery({ name: 'role', required: false, type: String, example: 'Doctor' })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'waseem' })
  async findAll(@Req() req: any) {
    const data = await this.userService.findAll(req.query);
    return {
      success: true,
      message: 'Users fetched successfully',
      data
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single user by id' })
  @ApiResponse({
    status: 200,
    description: 'Entity retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
        department: { type: 'string' },
        phone: { type: 'string' },
        gender: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const user = this.userService.findOne(id)
    return {
      success: true,
      message: 'User fetched successfully',
      data: { user }
    };
  }

  @Patch('doctor/:id')
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
  async updateDoctor(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.userService.updateDoctor(id, updateDoctorDto);
  }

  @Patch('nurse/:id')
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
  async updateNurse(@Param('id') id: string, @Body() updateNurseDto: UpdateNurseDto) {
    return this.userService.updateNurse(id, updateNurseDto);
  }

  @Patch('staff/:id')
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
  async updateStaff(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.userService.updateStaff(id, updateStaffDto);
  }

  @Roles(UserRole.Admin)
  @Delete(':id')
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
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = await this.userService.remove(id);
    return {
      success: true,
      message: 'User deleted successfully',
      data: { user },
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile', schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
      role: { type: 'string' },
      department: { type: 'string' },
      phone: { type: 'string' },
      gender: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  } })
  @ApiResponse({ status: 400, description: 'Bad Request', schema: { type: 'object', properties: { statusCode: { type: 'number' }, message: { type: 'string' }, error: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized', schema: { type: 'object', properties: { statusCode: { type: 'number', example: 401 }, message: { type: 'string', example: 'Unauthorized' } } } })
  async getCurrentUser(@Req() req: any) {
    return this.userService.findOne(req.user.id);
  }

  @Get('doctor/:id/slots')
  @ApiOperation({ summary: 'Get doctor available time slots' })
  @ApiQuery({ name: 'date', required: true, type: String, description: 'Date in YYYY-MM-DD format' })
  @ApiResponse({
    status: 200,
    description: 'Available slots',
    schema: {
      type: 'object',
      properties: {
        slots: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              time: { type: 'string', example: '09:00' },
              available: { type: 'boolean' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request', schema: { type: 'object', properties: { statusCode: { type: 'number' }, message: { type: 'string' }, error: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized', schema: { type: 'object', properties: { statusCode: { type: 'number', example: 401 }, message: { type: 'string', example: 'Unauthorized' } } } })
  async getDoctorSlots(@Param('id') id: string, @Req() req: any) {
    // TODO: Implement real slot logic
    return { slots: [
      { time: '09:00', available: true },
      { time: '10:00', available: false },
      { time: '11:00', available: true }
    ]};
  }

  @Get('my-appointments')
  @ApiOperation({ summary: 'Get current user appointments' })
  @ApiResponse({ status: 200, description: 'User appointments', schema: { type: 'object', properties: { data: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, date: { type: 'string' }, doctor: { type: 'string' }, status: { type: 'string' } } } } } } })
  @ApiResponse({ status: 400, description: 'Bad Request', schema: { type: 'object', properties: { statusCode: { type: 'number' }, message: { type: 'string' }, error: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized', schema: { type: 'object', properties: { statusCode: { type: 'number', example: 401 }, message: { type: 'string', example: 'Unauthorized' } } } })
  async getMyAppointments(@Req() req: any) {
    // TODO: Implement real appointment logic
    return { data: [
      { id: '1', date: '2025-08-18', doctor: 'Dr. Smith', status: 'confirmed' },
      { id: '2', date: '2025-08-19', doctor: 'Dr. Jones', status: 'pending' }
    ]};
  }

  /**
   * Check if current user can access target user's information
   */
  private canAccessUser(currentUser: any, targetUser: any, targetId: string): boolean {
    // Admins can access any user
    if (currentUser.role === UserRole.Admin) {
      return true;
    }

    // Users can access their own information
    if (currentUser._id && targetId === String(currentUser._id)) {
      return true;
    }


    return false;
  }

  /**
   * Check if current user can modify target user
   */
  private canModifyUser(currentUser: any, targetUser: any, targetId: string): boolean {
    // Admins can modify any user
    if (currentUser.role === UserRole.Admin) {
      return true;
    }

    // Users can modify their own information
    if (currentUser._id && targetId === String(currentUser._id)) {
      return true;
    }


    return false;
  }

  /**
   * Check if current user can delete target user
   */
  private canDeleteUser(currentUser: any, targetUser: any): boolean {
    // Only admins and department managers can delete users
    if (currentUser.role === UserRole.Admin) {
      return true;
    }



    return false;
  }

  /**
   * Check if two users are in the same department
   */
  private isInSameDepartment(user1: any, user2: any): boolean {
    return (
      user1.departmentId &&
      user2.departmentId &&
      'departmentId' in user1 &&
      'departmentId' in user2 &&
      String(user1.departmentId) === String(user2.departmentId)
    );
  }
}
