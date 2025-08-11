
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/Review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>
  ) { }

  async create(createReviewDto: CreateReviewDto) {
    const created = new this.reviewModel(createReviewDto);
    await created.save();
    return {
      success: true,
      message: 'Review created successfully',
      data: { created },
      errors: null
    };
  }

  async findAll() {
    const reviews = await this.reviewModel.find().exec();
    return {
      success: true,
      message: 'Reviews fetched successfully',
      data: { reviews },
      errors: null
    };
  }

  async findOne(id: string) {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) throw new NotFoundException('Review not found');
    return {
      success: true,
      message: 'Review fetched successfully',
      data: { review },
      errors: null
    };
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const updated = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true, runValidators: true }).exec();
    if (!updated) throw new NotFoundException('Review not found');
    return {
      success: true,
      message: 'Review updated successfully',
      data: { updated },
      errors: null
    };
  }

  async remove(id: string) {
    const deleted = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Review not found');
    return {
      success: true,
      message: 'Review deleted successfully',
      data: { deleted },
      errors: null
    };
  }
}
