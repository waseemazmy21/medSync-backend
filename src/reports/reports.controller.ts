
import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { RolesGuard } from '../rbac/roles.guard';
import { Roles } from '../rbac/roles.decorator';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsDateString, IsOptional, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
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

  /**
   * Get a general AI-powered performance report for all reviews.
   *
   * @param period Optional period filter with 'from' and 'to' ISO 8601 date strings.
   * @returns General performance report including AI summary, average rating, and total reviews.
   */
  @Get('performance')
  @ApiOperation({ summary: 'Get general performance report (AI-powered)', description: 'Returns an AI-generated summary of overall hospital performance, trends, and suggestions based on all patient reviews.' })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'Start date (ISO 8601, optional)' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'End date (ISO 8601, optional)' })
  @ApiResponse({ status: 200, description: 'General performance report', schema: { example: { averageRating: 4.2, totalReviews: 120, aiSummary: 'The overall sentiment is positive. Patients appreciate...' } } })
  async getPerformanceReport(
    @Query() period: PeriodQuery
  ) {
    if (period.from && period.to && new Date(period.from) > new Date(period.to)) {
      throw new BadRequestException("'from' date must be before 'to' date");
    }
    return this.reportsService.getPerformanceReport(period.from, period.to);
  }

  /**
   * Get a report of common complaints and suggestions (AI-powered) for all reviews.
   *
   * @param period Optional period filter with 'from' and 'to' ISO 8601 date strings.
   * @returns AI-generated list of recurring complaints, suggestions, and trends.
   */
  @Get('complaints')
  @ApiOperation({ summary: 'Get common complaints and suggestions (AI-powered)', description: 'Returns an AI-generated list of recurring complaints, suggestions, and trends from all patient reviews.' })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'Start date (ISO 8601, optional)' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'End date (ISO 8601, optional)' })
  @ApiResponse({ status: 200, description: 'Common complaints and suggestions report', schema: { example: { recurringComplaints: '- Long waiting times\n- Unclear instructions\n- ...' } } })
  async getComplaintsReport(
    @Query() period: PeriodQuery
  ) {
    if (period.from && period.to && new Date(period.from) > new Date(period.to)) {
      throw new BadRequestException("'from' date must be before 'to' date");
    }
    return this.reportsService.getComplaintsReport(period.from, period.to);
  }
}
