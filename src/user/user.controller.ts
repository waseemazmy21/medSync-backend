import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/rbac/roles.guard';
import { UserRole } from 'src/common/types';
import { Roles } from 'src/rbac/roles.decorator';
import { User } from './schemas/User.schema';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.Admin)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles(UserRole.Admin, UserRole.DepartmentManager)
  @Get()
  async findAll(@Req() req: any) {
    try {
      // Admins can see all users, department managers only see users in their department
      const filter = req.user.role === UserRole.DepartmentManager && req.user.departmentId
        ? { departmentId: req.user.departmentId }
        : {};
      
      return await this.userService.findAll(filter);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve users',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles(
    UserRole.Admin,
    UserRole.DepartmentManager,
    UserRole.Doctor,
    UserRole.Nurse,
    UserRole.Staff,
  )
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    try {
      const currentUser = req.user;
      const targetUser = await this.userService.findOne(id);
      
      if (!targetUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Check access permissions
      if (!this.canAccessUser(currentUser, targetUser, id)) {
        throw new HttpException(
          'You do not have permission to access this user',
          HttpStatus.FORBIDDEN
        );
      }

      return targetUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles(
    UserRole.Admin,
    UserRole.DepartmentManager,
    UserRole.Doctor,
    UserRole.Nurse,
    UserRole.Staff,
    UserRole.Patient,
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    try {
      const currentUser = req.user;
      const targetUser = await this.userService.findOne(id);
      
      if (!targetUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Check update permissions
      if (!this.canModifyUser(currentUser, targetUser, id)) {
        throw new HttpException(
          'You do not have permission to update this user',
          HttpStatus.FORBIDDEN
        );
      }

      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Roles(UserRole.Admin, UserRole.DepartmentManager)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    try {
      const currentUser = req.user;
      const targetUser = await this.userService.findOne(id);
      
      if (!targetUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Business rule: Cannot delete an Admin
      if (targetUser.role === UserRole.Admin) {
        throw new HttpException(
          'Admin users cannot be deleted',
          HttpStatus.FORBIDDEN
        );
      }

      // Business rule: Admins cannot delete themselves
      if (currentUser.role === UserRole.Admin && id === String(currentUser._id)) {
        throw new HttpException(
          'You cannot delete your own admin account',
          HttpStatus.FORBIDDEN
        );
      }

      // Check deletion permissions
      if (!this.canDeleteUser(currentUser, targetUser)) {
        throw new HttpException(
          'You do not have permission to delete this user',
          HttpStatus.FORBIDDEN
        );
      }

      return await this.userService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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

    // Department managers can access users in their department
    if (currentUser.role === UserRole.DepartmentManager) {
      return this.isInSameDepartment(currentUser, targetUser);
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

    // Department managers can modify users in their department
    if (currentUser.role === UserRole.DepartmentManager) {
      return this.isInSameDepartment(currentUser, targetUser);
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

    // Department managers can delete users in their department
    if (currentUser.role === UserRole.DepartmentManager) {
      return this.isInSameDepartment(currentUser, targetUser);
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
