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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/rbac/roles.guard';
import { UserRole } from 'src/common/types';
import { Roles } from 'src/rbac/roles.decorator';
import { UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.Admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles(UserRole.Admin)
  @Get()
  findAll(@Req() req) {
    return this.userService.findAll(
      req.user.departmentId !== undefined
        ? { departmentId: req.user.departmentId }
        : {},
    );
  }


  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    // Admins can access any user
    if (user.role === UserRole.Admin) {
      return this.userService.findOne(id);
    }
    // DepartmentManager can access users in their department
    if (user.role === UserRole.DepartmentManager) {
      // Retrieve both target user and department manager from DB
      const targetUser = await this.userService.findOne(id);
      const managerUser = await this.userService.findOne(user._id);
      if (
        targetUser &&
        managerUser &&
        'departmentId' in targetUser &&
        'departmentId' in managerUser &&
        targetUser.departmentId &&
        managerUser.departmentId &&
        String(targetUser.departmentId) === String(managerUser.departmentId)
      ) {
        return targetUser;
      } else {
        return { message: 'Not Authorized' };
      }
    }
    // All users can access their own info
    if (user._id && id === String(user._id)) {
      return this.userService.findOne(id);
    }
    return { message: 'Not Authorized' };
  }

  
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    const user = req.user;
    // Admins can update any user
    if (user.role === UserRole.Admin) {
      return this.userService.update(id, updateUserDto);
    }
    // DepartmentManager can update users in their department
    if (user.role === UserRole.DepartmentManager) {
      // Retrieve both target user and department manager from DB
      const targetUser = await this.userService.findOne(id);
      const managerUser = await this.userService.findOne(user._id);
      if (
        targetUser &&
        managerUser &&
        'departmentId' in targetUser &&
        'departmentId' in managerUser &&
        targetUser.departmentId &&
        managerUser.departmentId &&
        String(targetUser.departmentId) === String(managerUser.departmentId)
      ) {
        return this.userService.update(id, updateUserDto);
      } else {
        return { message: 'Not Authorized' };
      }
    }
    // All users can update their own info
    if (user._id && id === String(user._id)) {
      return this.userService.update(id, updateUserDto);
    }
    return { message: 'Not Authorized' };
  }

  
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    const targetUser = await this.userService.findOne(id);
    if (!targetUser) {
      return { message: 'User not found' };
    }
    // Cannot delete an Admin
    if (targetUser.role === UserRole.Admin) {
      return { message: 'Cannot delete an Admin' };
    }
    // Admins cannot delete themselves
    if (user.role === UserRole.Admin) {
      if (id === String(user._id)) {
        return { message: 'Admin cannot delete themselves' };
      }
      return this.userService.remove(id);
    }
    // DepartmentManager can delete users in their department
    if (user.role === UserRole.DepartmentManager) {
      if (
        'departmentId' in targetUser &&
        'departmentId' in user &&
        targetUser.departmentId &&
        user.departmentId &&
        String(targetUser.departmentId) === String(user.departmentId)
      ) {
        return this.userService.remove(id);
      } else {
        return { message: 'Forbidden' };
      }
    }
    // Users can delete themselves
    if (user._id && id === String(user._id)) {
      return this.userService.remove(id);
    }
    return { message: 'Forbidden' };
  }
}
