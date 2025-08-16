
import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from 'src/rbac/roles.decorator';
import { UserRole } from 'src/common/types';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }
  @Roles(UserRole.Patient)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    const review = await this.reviewService.create(createReviewDto);
    return {
      success: true,
      message: 'Review created successfully',
      data: { review },
    };
  }

  @Roles(UserRole.Admin)
  @Get()
  async findAll() {
    const reviews = await this.reviewService.findAll();
    return {
      success: true,
      message: 'Reviews fetched successfully',
      data: { reviews },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const review = await this.reviewService.findOne(id);
    return {
      success: true,
      message: 'Review fetched successfully',
      data: { review },
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Req() req: any) {
    const review = await this.reviewService.update(id, updateReviewDto, req.user.sub);
    return {
      success: true,
      message: 'Review updated successfully',
      data: { review },
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const review = await this.reviewService.remove(id, req.user.sub, req.user.role);
    return {
      success: true,
      message: 'Review deleted successfully',
      data: { review },
    };
  }
}
