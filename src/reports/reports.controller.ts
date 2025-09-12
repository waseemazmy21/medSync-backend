
import { Controller, Get, Query, UseGuards, BadRequestException, Param } from '@nestjs/common';
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
@Roles(UserRole.Doctor)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get('departments/:id/generate')
  @ApiOperation({ summary: 'Get department report (AI-powered)', description: 'Returns an AI-generated report for a specific department or all reviews, including overview, pros, cons, average rating, and total reviews.' })
  @ApiQuery({ name: 'departmentId', required: false, type: String, description: 'Department Mongo ID (optional)' })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'Start date (ISO 8601, optional)' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'End date (ISO 8601, optional)' })
  @ApiResponse({ status: 200, description: 'Department report', schema: { example: { overview: '...', pros: ['...'], cons: ['...'], averageRating: 4.2, totalReviews: 120 } } })
  async getDepartmentReport(
    @Param('id') id: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    if (from && to && new Date(from) > new Date(to)) {
      throw new BadRequestException("'from' date must be before 'to' date");
    }
    const report = await this.reportsService.getDepartmentReport(id, from, to);
    return {
      success: true,
      message: "Report generated successfully",
      data: {
        report
      }
    }
  }

  @Get('departments/:id')
  @ApiOperation({ summary: 'Get all department reports (paginated)', description: 'Returns paginated department reports.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default 10)' })
  @ApiResponse({ status: 200, description: 'Paginated department reports', schema: { example: { data: [{ overview: '...', pros: ['...'], cons: ['...'], averageRating: 4.2, totalReviews: 120 }], total: 20, page: 1, limit: 10 } } })
  async getAllDepartmentReports(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.reportsService.getAllDepartmentReports(id, page, limit);
    return {
      message: "Reports retrieved successfully",
      data
    }
  }
}
