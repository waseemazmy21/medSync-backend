import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  UpdateAppointmentByDoctorDto,
  UpdateAppointmentByPatientDto,
} from './dto/update-appointment.dto';
import { RolesGuard } from 'src/rbac/roles.guard';
import { Roles } from 'src/rbac/roles.decorator';
import { UserRole } from 'src/common/types';

@UseGuards(RolesGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // A patient can book an appointment
  @Roles(UserRole.Patient)
  @Post()
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() req: any,
  ) {
    try {
      const patientId = req.user.sub;
      const appointment = await this.appointmentService.create(
        createAppointmentDto,
        patientId,
      );

      return {
        success: true,
        message: 'Appointment created successfully',
        data: { appointment },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to create appointment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(UserRole.Admin, UserRole.Doctor, UserRole.Patient)
  @Get()
  async findAll(@Req() req: any) {
    try {
      let appointments;
      const currentUser = req.user;

      switch (currentUser.role) {
        case UserRole.Admin:
          // Admins can see all appointments
          appointments = await this.appointmentService.findAll();
          break;
        case UserRole.Doctor:
          // Doctors can see appointments assigned to them
          appointments = await this.appointmentService.findByDoctor(
            currentUser.sub,
          );
          break;
        case UserRole.Patient:
          // Patients can see their own appointments
          appointments = await this.appointmentService.findByPatient(
            currentUser.sub,
          );
          break;
        default:
          throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
      }

      return {
        success: true,
        message: 'Appointments retrieved successfully',
        data: { appointments },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve appointments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(UserRole.Admin, UserRole.Doctor, UserRole.Patient)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    try {
      const appointment = await this.appointmentService.findOne(id);
      const currentUser = req.user;

      // Check access permissions
      if (!this.canAccessAppointment(currentUser, appointment)) {
        throw new HttpException(
          'You do not have permission to access this appointment',
          HttpStatus.FORBIDDEN,
        );
      }

      return {
        success: true,
        message: 'Appointment retrieved successfully',
        data: { appointment },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve appointment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(UserRole.Doctor, UserRole.Patient)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateDto: UpdateAppointmentByDoctorDto | UpdateAppointmentByPatientDto,
    @Req() req: any,
  ) {
    try {
      const appointment = await this.appointmentService.findOne(id);
      const currentUser = req.user;

      // Check if user can modify this appointment
      if (!this.canAccessAppointment(currentUser, appointment)) {
        throw new HttpException(
          'You do not have permission to access this appointment',
          HttpStatus.FORBIDDEN,
        );
      }

      // Validate and process update based on user role
      let updateData: any = {};

      if (currentUser.role === UserRole.Doctor) {
        // Doctors can update notes, prescription, and followUpDate
        if (String(appointment.doctor._id) !== String(currentUser.sub)) {
          throw new HttpException(
            'You can only update appointments assigned to you',
            HttpStatus.FORBIDDEN,
          );
        }

        const doctorDto = updateDto as UpdateAppointmentByDoctorDto;
        updateData = {
          notes: doctorDto.notes,
          prescription: doctorDto.prescription,
          followUpDate: doctorDto.followUpDate,
        };

        // Remove undefined values
        Object.keys(updateData).forEach(
          (key) => updateData[key] === undefined && delete updateData[key],
        );
      } else if (currentUser.role === UserRole.Patient) {
        // Patients can only update date, with 24-hour rule
        if (String(appointment.patient._id) !== String(currentUser.sub)) {
          throw new HttpException(
            'You can only update your own appointments',
            HttpStatus.FORBIDDEN,
          );
        }

        const patientDto = updateDto as UpdateAppointmentByPatientDto;

        if (patientDto.date) {
          // Check 24-hour rule
          if (!this.canModifyAppointmentDate(appointment.date)) {
            throw new HttpException(
              'You can only modify appointment date at least 24 hours before the appointment',
              HttpStatus.FORBIDDEN,
            );
          }
          updateData.date = patientDto.date;
        }
      }

      if (Object.keys(updateData).length === 0) {
        throw new HttpException(
          'No valid fields to update',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedAppointment = await this.appointmentService.update(
        id,
        updateData,
      );

      return {
        success: true,
        message: 'Appointment updated successfully',
        data: { appointment: updatedAppointment },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update appointment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(UserRole.Patient)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    try {
      const appointment = await this.appointmentService.findOne(id);
      const currentUser = req.user;

      // Only patients can delete appointments, and only their own
      if (String(appointment.patient._id) !== String(currentUser.sub)) {
        throw new HttpException(
          'You can only delete your own appointments',
          HttpStatus.FORBIDDEN,
        );
      }

      // Check 24-hour rule
      if (!this.canModifyAppointmentDate(appointment.date)) {
        throw new HttpException(
          'You can only delete appointments at least 24 hours before the appointment time',
          HttpStatus.FORBIDDEN,
        );
      }

      const deletedAppointment = await this.appointmentService.remove(id);

      return {
        success: true,
        message: 'Appointment deleted successfully',
        data: { appointment: deletedAppointment },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete appointment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Check if current user can access the appointment
   */
  private canAccessAppointment(currentUser: any, appointment: any): boolean {
    // Admins can access any appointment
    if (currentUser.role === UserRole.Admin) {
      return true;
    }

    // Doctors can access appointments assigned to them
    if (currentUser.role === UserRole.Doctor) {
      return String(appointment.doctor._id) === String(currentUser.sub);
    }

    // Patients can access their own appointments
    if (currentUser.role === UserRole.Patient) {
      return String(appointment.patient._id) === String(currentUser.sub);
    }

    return false;
  }

  /**
   * Check if appointment can be modified (24-hour rule)
   */
  private canModifyAppointmentDate(appointmentDate: Date): boolean {
    const now = new Date();
    const appointmentTime = new Date(appointmentDate);
    const timeDifference = appointmentTime.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference >= 24;
  }
}
