
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/Review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserRole } from 'src/common/types';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>
  ) { }

  async create(createReviewDto: CreateReviewDto) {
    const created = new this.reviewModel({
      patient: new Types.ObjectId(createReviewDto.patient),
      department: new Types.ObjectId(createReviewDto.department),
      appointment: new Types.ObjectId(createReviewDto.appointment),
      doctor: new Types.ObjectId(createReviewDto.doctor),
      rating: createReviewDto.rating,
      feedback: createReviewDto.feedback,
    });
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

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string) {
    const updated = await this.reviewModel.findOneAndUpdate({ _id: id, patient: userId }, updateReviewDto, { new: true, runValidators: true });
    if (!updated) throw new NotFoundException('Review not found');
    return updated
  }

  async remove(id: string, userId: string, role: UserRole) {
    let deleted;

    if (role === UserRole.Admin) {
      // Admin can delete any review
      deleted = await this.reviewModel.findByIdAndDelete(id);
    } else {
      // Patient can only delete their own review
      deleted = await this.reviewModel.findOneAndDelete({ _id: id, patient: userId });
    }

    if (!deleted) throw new NotFoundException('Review not found');
    return deleted;
  }

  async findByDepartment(departmentId: string) {
    return this.reviewModel.find({ department: new Types.ObjectId(departmentId) });
  }
}
