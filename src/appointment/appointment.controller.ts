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
import { Query } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  UpdateAppointmentByDoctorDto,
  UpdateAppointmentByPatientDto,
} from './dto/update-appointment.dto';
import { RolesGuard } from 'src/rbac/roles.guard';
import { Roles } from 'src/rbac/roles.decorator';
import { AppointmentStatus, UserRole } from 'src/common/types';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Appointment } from './schemas/Appointment.schema';
import { Types } from 'mongoose';
import { NotificationService } from '../notification/notification.service';

@ApiTags('Appointment')
@UseGuards(RolesGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly notificationService: NotificationService,
  ) { }

  // A patient can book an appointment
  @Roles(UserRole.Patient)
  @Post()
  @ApiOperation({ summary: 'Book a new appointment (Patient only)' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({ status: 201, description: 'Appointment created successfully', schema: { example: { success: true, message: 'Appointment created successfully', data: { appointment: {} } } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Failed to create appointment' })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() req: any,
  ) {
    try {
      const patientId = req.user.sub;
      console.log('CreateAppointmentDto:', createAppointmentDto);
      console.log('PatientId:', patientId);
      const appointment = await this.appointmentService.create(
        createAppointmentDto,
        patientId,
      );
      console.log('Created appointment:', appointment);
      // Notify doctor if assigned
      if (appointment.doctor) {
        await this.notificationService.create({
          recipient: appointment.doctor.toString(),
          title: 'New Appointment Assigned',
          message: `You have been assigned a new appointment with patient.`
        });
      }
      return {
        success: true,
        message: 'Appointment created successfully',
        data: { appointment },
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      // If error is a known HttpException, rethrow it
      if (error instanceof HttpException) {
        throw error;
      }
      // Custom verbose error for no doctors available
      if (error?.message?.includes('no doctors available')) {
        throw new HttpException(
          'No doctors are available in the selected department. Please choose another department or try again later.',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Fallback to generic error
      throw new HttpException(
        error?.message || 'Failed to create appointment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles(UserRole.Admin, UserRole.Doctor, UserRole.Patient)
  @Get()
  @ApiOperation({ summary: 'Get all appointments (role-based, paginated)' })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully', schema: { example: { success: true, message: 'Appointments retrieved successfully', data: { appointments: [], total: 0, page: 1, limit: 10 } } } })
  @ApiResponse({ status: 403, description: 'Unauthorized access' })
  @ApiResponse({ status: 500, description: 'Failed to retrieve appointments' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'date', required: false, description: 'Filter by appointment date (YYYY-MM-DD)', example: '2025-09-01' })
  @ApiQuery({ name: 'when', required: false, description: "Filter by 'before' or 'after' the date", example: 'before' })
  async findAll(
    @Req() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('date') date?: string,
    @Query('when') when?: 'before' | 'after',
    @Query('status') status?: AppointmentStatus,
  ) {
    try {
      const currentUser = req.user;
      const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
      const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;

      let filter: any = {};
      if (date) {
        const start = new Date(date);
        if (isNaN(start.getTime())) {
          throw new HttpException('Invalid date format', HttpStatus.BAD_REQUEST);
        }
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        if (when === 'before') {
          filter.date = { $lt: start };
        } else if (when === 'after') {
          filter.date = { $gt: end };
        } else {
          filter.date = { $gte: start, $lte: end };
        }
      }
      if (status) {
        filter.status = status;
      }

      let result;
      const userId = currentUser.sub as string;
      switch (currentUser.role) {
        case UserRole.Admin:
          result = await this.appointmentService.findAll(filter, pageNum, limitNum);
          break;
        case UserRole.Doctor:
          // Ensure userId is a valid ObjectId string
          let doctorObjectId;
          if (Types.ObjectId.isValid(userId)) {
            doctorObjectId = new Types.ObjectId(userId);
          } else {
            console.warn('Doctor userId is not a valid ObjectId:', userId);
            doctorObjectId = userId;
          }
          filter.doctor = doctorObjectId;
          result = await this.appointmentService.findAll(filter, pageNum, limitNum);
          break;
        case UserRole.Patient:
          let patientObjectId;
          if (Types.ObjectId.isValid(userId)) {
            patientObjectId = new Types.ObjectId(userId);
          } else {
            console.warn('Patient userId is not a valid ObjectId:', userId);
            patientObjectId = userId;
          }
          filter.patient = patientObjectId;
          result = await this.appointmentService.findAll(filter, pageNum, limitNum);
          break;
        default:
          throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
      }
      return {
        success: true,
        message: 'Appointments retrieved successfully',
        data: {
          appointments: result.data,
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve appointments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Roles(UserRole.Admin, UserRole.Doctor, UserRole.Patient)
  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID (role-based)' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'Appointment retrieved successfully', schema: { example: { success: true, message: 'Appointment retrieved successfully', data: { appointment: {} } } } })
  @ApiResponse({ status: 403, description: 'You do not have permission to access this appointment' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  @ApiResponse({ status: 500, description: 'Failed to retrieve appointment' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    try {
      console.log('findOne called with id:', id);
      console.log('Is valid ObjectId:', require('mongoose').Types.ObjectId.isValid(id));
      const appointment = await this.appointmentService.findOne(id);
      console.log('findOne result:', appointment);
      if (!appointment) {
        throw new HttpException(
          'Appointment not found',
          HttpStatus.NOT_FOUND,
        );
      }
      const currentUser = req.user;
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
      console.error('Error in findOne:', error);
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
  @ApiOperation({ summary: 'Update appointment (Doctor/Patient)' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiBody({ schema: { oneOf: [{ $ref: '#/components/schemas/UpdateAppointmentByDoctorDto' }, { $ref: '#/components/schemas/UpdateAppointmentByPatientDto' }] } })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully', schema: { example: { success: true, message: 'Appointment updated successfully', data: { appointment: {} } } } })
  @ApiResponse({ status: 400, description: 'No valid fields to update' })
  @ApiResponse({ status: 403, description: 'You do not have permission to access this appointment' })
  @ApiResponse({ status: 500, description: 'Failed to update appointment' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAppointmentByDoctorDto | UpdateAppointmentByPatientDto,
    @Req() req: any,
  ) {
    try {
      const appointment = await this.appointmentService.findOne(id);
      const currentUser = req.user;
      if (!this.canAccessAppointment(currentUser, appointment)) {
        throw new HttpException(
          'You do not have permission to access this appointment',
          HttpStatus.FORBIDDEN,
        );
      }
      let updateData: any = {};
      let notifyUserId: string | null = null;
      let notifyRole: 'doctor' | 'patient' | null = null;
      if (currentUser.role === UserRole.Doctor) {
        if (String(appointment.doctor._id) !== String(currentUser.sub)) {
          throw new HttpException(
            'You can only update appointments assigned to you',
            HttpStatus.FORBIDDEN,
          );
        }
        const doctorDto = updateDto as UpdateAppointmentByDoctorDto;
        updateData.notes = doctorDto.notes;
        updateData.followUpDate = doctorDto.followUpDate;
        updateData.status = doctorDto.status;
        // Ensure prescription is always an array of objects
        if (doctorDto.prescription && Array.isArray(doctorDto.prescription)) {
          updateData.prescription = doctorDto.prescription.map(p => ({
            medicine: p.medicine,
            dose: p.dose
          }));
        }
        Object.keys(updateData).forEach(
          (key) => updateData[key] === undefined && delete updateData[key],
        );
        notifyUserId = appointment.patient._id?.toString();
        notifyRole = 'patient';
      } else if (currentUser.role === UserRole.Patient) {
        if (String(appointment.patient._id) !== String(currentUser.sub)) {
          throw new HttpException(
            'You can only update your own appointments',
            HttpStatus.FORBIDDEN,
          );
        }
        const patientDto = updateDto as UpdateAppointmentByPatientDto;
        if (patientDto.date) {
          // Ensure date is valid and at least 24 hours before appointment
          const newDate = new Date(patientDto.date);
          if (isNaN(newDate.getTime())) {
            throw new HttpException('Invalid date format', HttpStatus.BAD_REQUEST);
          }
          if (!this.canModifyAppointmentDate(appointment.date)) {
            throw new HttpException(
              'You can only modify appointment date at least 24 hours before the appointment',
              HttpStatus.FORBIDDEN,
            );
          }
          updateData.date = newDate;
        }
        notifyUserId = appointment.doctor._id?.toString();
        notifyRole = 'doctor';
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
      // Notify the other party
      if (notifyUserId && notifyRole) {
        await this.notificationService.create({
          recipient: notifyUserId,
          title: 'Appointment Updated',
          message: `Your appointment was updated by the ${notifyRole}.`
        });
      }
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

  @Roles(UserRole.Patient, UserRole.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete appointment (Patient only)' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully', schema: { example: { success: true, message: 'Appointment deleted successfully', data: { appointment: {} } } } })
  @ApiResponse({ status: 403, description: 'You can only delete your own appointments' })
  @ApiResponse({ status: 500, description: 'Failed to delete appointment' })
  async remove(@Param('id') id: string, @Req() req: any) {
    try {
      console.log('Entered AppointmentController.remove endpoint with id:', id);
      const appointment = await this.appointmentService.findOne(id);
      const currentUser = req.user;
      console.log('Remove appointment called by user:', currentUser);
      if (currentUser.role !== UserRole.Admin) {
        if (String(appointment.patient._id) !== String(currentUser.sub)) {
          throw new HttpException(
            'You can only delete your own appointments',
            HttpStatus.FORBIDDEN,
          );
        }
        if (!this.canModifyAppointmentDate(appointment.date)) {
          throw new HttpException(
            'You can only delete appointments at least 24 hours before the appointment time',
            HttpStatus.FORBIDDEN,
          );
        }
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
