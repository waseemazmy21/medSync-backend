
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    const review = await this.reviewService.create(createReviewDto);
    return {
      success: true,
      message: 'Review created successfully',
      data: { review },
    };
  }

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
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewService.update(id, updateReviewDto);
    return {
      success: true,
      message: 'Review updated successfully',
      data: { review },
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const review = await this.reviewService.remove(id);
    return {
      success: true,
      message: 'Review deleted successfully',
      data: { review },
    };
  }
}
