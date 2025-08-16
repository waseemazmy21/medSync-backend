
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
    return created.save();
  }

  async findAll() {
    const reviews = await this.reviewModel.find();
    return reviews
  }

  async findOne(id: string) {
    const review = await this.reviewModel.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    return review
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const updated = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true, runValidators: true });
    if (!updated) throw new NotFoundException('Review not found');
    return updated
  }

  async remove(id: string) {
    const deleted = await this.reviewModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Review not found');
    return deleted
  }
}
