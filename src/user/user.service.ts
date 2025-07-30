import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/User.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Add actual user creation logic
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(filter?: { departmentId?: string }) {
    if (filter && filter.departmentId) {
      return this.userModel.find({ departmentId: filter.departmentId });
    }
    return this.userModel.find();
  }

  async findAllWithAuth(user: any) {
    if (user.role === 'Admin') {
      return this.userModel.find();
    }
    return { message: 'Not Authorized' };
  }

  async findOne(id: string) {
    return this.userModel.findById(id);
  }

  async findOneWithAuth(id: string, user: any) {
    if (user.role === 'Admin') {
      return this.userModel.findById(id);
    }
    if (user._id && (id === String(user._id))) {
      return this.userModel.findById(id);
    }
    return { message: 'Not Authorized' };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async updateWithAuth(id: string, updateUserDto: UpdateUserDto, user: any) {
    const targetUser = await this.userModel.findById(id);
    if (!targetUser) {
      return { message: 'User not found' };
    }
    if (user.role === 'Admin' || (user._id && (id === String(user._id)))) {
      return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    }
    return { message: 'Forbidden' };
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async removeWithAuth(id: string, user: any) {
    const targetUser = await this.userModel.findById(id);
    if (!targetUser) {
      return { message: 'User not found' };
    }
    if (targetUser.role === 'Admin') {
      return { message: 'Cannot delete an Admin' };
    }
    if (user.role === 'Admin') {
      if (id === String(user._id)) {
        return { message: 'Admin cannot delete themselves' };
      }
      return this.userModel.findByIdAndDelete(id);
    }
    if (user._id && (id === String(user._id))) {
      return this.userModel.findByIdAndDelete(id);
    }
    return { message: 'Forbidden' };
  }
}
