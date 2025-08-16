import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/User.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'src/common/types';
import { CreateNurseDto } from './dto/create-nurse.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { Doctor, DoctorDocument } from './schemas/Doctor.schema';
import { Nurse, NurseDocument } from './schemas/Nurse.schema';
import { Staff, StaffDocument } from './schemas/Staff.schema';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { UpdateNurseDto } from './dto/update-nurse.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Nurse.name) private nurseModel: Model<NurseDocument>,
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>
  ) { }

  async createDoctor(dto: CreateDoctorDto) {
    let existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    existingUser = await this.userModel.findOne({ phone: dto.phone });
    if (existingUser) {
      throw new ConflictException('Phone already exists');
    }

    const doctor = new this.doctorModel({
      ...dto,
      role: UserRole.Doctor,
    });
    return doctor.save();
  }

  async createNurse(dto: CreateNurseDto) {
    let existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    existingUser = await this.userModel.findOne({ phone: dto.phone });
    if (existingUser) {
      throw new ConflictException('Phone already exists');
    }

    const nurse = new this.nurseModel({
      ...dto,
      role: UserRole.Nurse,
    });
    return nurse.save();
  }

  async createStaff(dto: CreateStaffDto) {
    let existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    existingUser = await this.userModel.findOne({ phone: dto.phone });
    if (existingUser) {
      throw new ConflictException('Phone already exists');
    }

    const staff = new this.staffModel({
      ...dto,
      role: UserRole.Staff,
    });
    return staff.save();
  }

  async findAll(query: any = {}) {
    const {
      page = 1,
      limit = 10,
      department,
      role,
      search,
    } = query;

    const filters: any = {};

    if (department) filters.department = new Types.ObjectId(department);
    if (role) filters.role = role;

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      this.userModel
        .find(filters)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      this.userModel.countDocuments(filters),
    ]);

    const data = {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    }

    return data
  }

  async findOne(id: string | any) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user
  }

  async updateDoctor(id: string, updateDoctorDto: UpdateDoctorDto) {
    const updated = await this.doctorModel.findByIdAndUpdate(id, updateDoctorDto, { new: true, runValidators: true });
    if (!updated) throw new NotFoundException('Doctor not found');
    return updated;
  }

  async updateNurse(id: string, updateNurseDto: UpdateNurseDto) {
    const updated = await this.nurseModel.findByIdAndUpdate(id, updateNurseDto, { new: true, runValidators: true });
    if (!updated) throw new NotFoundException('Nurse not found');
    return updated;
  }

  async updateStaff(id: string, updateStaffDto: UpdateStaffDto) {
    const updated = await this.staffModel.findByIdAndUpdate(id, updateStaffDto, { new: true, runValidators: true });
    if (!updated) throw new NotFoundException('Staff not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
    return deleted;
  }
}
