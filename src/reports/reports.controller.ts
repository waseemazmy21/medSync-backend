import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { RolesGuard } from '../rbac/roles.guard';
import { Roles } from '../rbac/roles.decorator';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, ValidateIf, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../common/types';

function IsFromBeforeTo(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFromBeforeTo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const to = (args.object as any)[property];
          if (!value || !to) return true;
          return new Date(value) <= new Date(to);
        },
        defaultMessage(args: ValidationArguments) {
          return `'from' date must be before 'to' date`;
        },
      },
    });
  };
}

class PeriodQuery {
  @IsOptional()
  @IsDateString({}, { message: 'from must be a valid ISO 8601 date string' })
  @IsFromBeforeTo('to')
  from?: string;

  @IsOptional()
  @IsDateString({}, { message: 'to must be a valid ISO 8601 date string' })
  to?: string;
}

@ApiTags('Reports')
@Controller('reports')
@UseGuards(RolesGuard)
@Roles(UserRole.Admin)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('doctor-performance')
  @ApiOperation({ summary: 'Get doctor performance report' })
  @ApiQuery({ name: 'doctorId', required: true, type: String })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'End date (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Doctor performance report' })
  async getDoctorPerformance(
    @Query('doctorId') doctorId: string,
    @Query() period: PeriodQuery
  ) {
    if (!doctorId) throw new BadRequestException('doctorId is required');
    if (period.from && period.to && new Date(period.from) > new Date(period.to)) {
      throw new BadRequestException("'from' date must be before 'to' date");
    }
    return this.reportsService.getDoctorPerformance(doctorId, period.from, period.to);
  }

  @Get('department-performance')
  @ApiOperation({ summary: 'Get department performance report' })
  @ApiQuery({ name: 'departmentId', required: true, type: String })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'End date (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Department performance report' })
  async getDepartmentPerformance(
    @Query('departmentId') departmentId: string,
    @Query() period: PeriodQuery
  ) {
    if (!departmentId) throw new BadRequestException('departmentId is required');
    if (period.from && period.to && new Date(period.from) > new Date(period.to)) {
      throw new BadRequestException("'from' date must be before 'to' date");
    }
    return this.reportsService.getDepartmentPerformance(departmentId, period.from, period.to);
  }

  @Get('recurring-complaints')
  @ApiOperation({ summary: 'Get recurring complaints and suggestions' })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'End date (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Recurring complaints and suggestions' })
  async getRecurringComplaints(
    @Query() period: PeriodQuery
  ) {
    if (period.from && period.to && new Date(period.from) > new Date(period.to)) {
      throw new BadRequestException("'from' date must be before 'to' date");
    }
    return this.reportsService.getRecurringComplaints(period.from, period.to);
  }
}
