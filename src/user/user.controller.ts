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
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { UpdateNurseDto } from './dto/update-nurse.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

// @UseGuards(RolesGuard, UseGuards)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Roles(UserRole.Admin)
  @Post('doctor')
  @ApiOperation({ summary: 'Create a doctor (admin only)' })
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
  async findOne(@Param('id') id: string, @Req() req: any) {
    const user = this.userService.findOne(id)
    return {
      success: true,
      message: 'User fetched successfully',
      data: { user }
    };
  }

  @Patch('doctor/:id')
  async updateDoctor(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    const user = await this.userService.updateDoctor(id, updateDoctorDto);
    return {
      success: true,
      message: 'Doctor updated successfully',
      data: { user },
    };
  }

  @Patch('nurse/:id')
  async updateNurse(@Param('id') id: string, @Body() updateNurseDto: UpdateNurseDto) {
    const user = await this.userService.updateNurse(id, updateNurseDto);
    return {
      success: true,
      message: 'Nurse updated successfully',
      data: { user },
    };
  }

  @Patch('staff/:id')
  async updateStaff(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    const user = await this.userService.updateStaff(id, updateStaffDto);
    return {
      success: true,
      message: 'Staff memeber updated successfully',
      data: { user },
    };

  }

  @Patch('patient/:id')
  async updatePatient(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    const user = await this.userService.updatePatient(id, updatePatientDto);
    return {
      success: true,
      message: 'Patient updated successfully',
      data: { user },
    };
  }

  @Roles(UserRole.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = await this.userService.remove(id);
    return {
      success: true,
      message: 'User deleted successfully',
      data: { user },
    };
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
