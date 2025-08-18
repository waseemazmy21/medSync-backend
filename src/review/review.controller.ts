
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from 'src/rbac/roles.decorator';
import { UserRole } from 'src/common/types';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Review } from './schemas/Review.schema';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }
  @Roles(UserRole.Patient)
  @Post()
  @ApiOperation({ summary: 'Create a new review (Patient only)' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Review created successfully', schema: { example: { success: true, message: 'Review created successfully', data: { review: {} } } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Failed to create review' })
  async create(@Body() createReviewDto: CreateReviewDto) {
    try {
      const review = await this.reviewService.create(createReviewDto);
      return {
        success: true,
        message: 'Review created successfully',
        data: { review },
      };
    } catch (error) {
      throw new HttpException('Failed to create review', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(UserRole.Admin)
  @Get()
  @ApiOperation({ summary: 'Get all reviews (Admin only)' })
  @ApiResponse({ status: 200, description: 'Reviews fetched successfully', schema: { example: { success: true, message: 'Reviews fetched successfully', data: { reviews: [] } } } })
  @ApiResponse({ status: 500, description: 'Failed to fetch reviews' })
  async findAll() {
    try {
      const reviews = await this.reviewService.findAll();
      return {
        success: true,
        message: 'Reviews fetched successfully',
        data: { reviews },
      };
    } catch (error) {
      throw new HttpException('Failed to fetch reviews', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review fetched successfully', schema: { example: { success: true, message: 'Review fetched successfully', data: { review: {} } } } })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 500, description: 'Failed to fetch review' })
  async findOne(@Param('id') id: string) {
    try {
      const review = await this.reviewService.findOne(id);
      return {
        success: true,
        message: 'Review fetched successfully',
        data: { review },
      };
    } catch (error) {
      throw new HttpException('Failed to fetch review', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({ status: 200, description: 'Review updated successfully', schema: { example: { success: true, message: 'Review updated successfully', data: { review: {} } } } })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 500, description: 'Failed to update review' })
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Req() req: any) {
    try {
      const review = await this.reviewService.update(id, updateReviewDto, req.user.sub);
      return {
        success: true,
        message: 'Review updated successfully',
        data: { review },
      };
    } catch (error) {
      throw new HttpException('Failed to update review', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully', schema: { example: { success: true, message: 'Review deleted successfully', data: { review: {} } } } })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 500, description: 'Failed to delete review' })
  async remove(@Param('id') id: string, @Req() req: any) {
    try {
      const review = await this.reviewService.remove(id, req.user.sub, req.user.role);
      return {
        success: true,
        message: 'Review deleted successfully',
        data: { review },
      };
    } catch (error) {
      throw new HttpException('Failed to delete review', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
