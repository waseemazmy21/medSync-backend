import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/User.schema';
import { PatientRegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Patient, PatientDocument } from 'src/user/schemas/Patient.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/common/types';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Patient.name)
    private readonly patientModel: Model<PatientDocument>,
    private readonly jwtService: JwtService,
    private readonly notifcationService: NotificationService
  ) { }

  async register(dto: PatientRegisterDto) {
    let existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    existingUser = await this.userModel.findOne({ phone: dto.phone });
    if (existingUser) {
      throw new ConflictException('Phone already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const patient = await this.patientModel.create({
      ...dto,
      password: hashedPassword,
      role: UserRole.Patient,
    });

    const payload = {
      sub: patient._id,
      role: patient.role,
    };

    const token = await this.jwtService.signAsync(payload);

    // send welcome notifcation
    this.notifcationService.sendWelcomeNotification(patient._id as string)

    return {
      message: 'Patient registered successfully',
      data: {
        accessToken: token,
        user: patient,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    let departmentId = "no-dep";
    if (user.role === UserRole.Doctor) {
      // Cast user to any to access departmentId, or use lean() in query for plain object
      departmentId = (user as any).departmentId;
    }

    const payload = {
      sub: user._id,
      role: user.role,
      departmentId,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      data: {
        accessToken: token,
        user,
      },
    };
  }
}
