
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    const created = new this.reviewModel(createReviewDto);
    return created.save();
  }



  async findByDoctorWithPeriod(doctorId: string, from?: string, to?: string) {
    const query: any = { doctor: doctorId };
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    return this.reviewModel.find(query);
  }



  async findByDepartmentWithPeriod(departmentId: string, from?: string, to?: string) {
    const query: any = { department: departmentId };
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    return this.reviewModel.find(query);
  }

  async findAllWithPeriod(from?: string, to?: string) {
    const query: any = {};
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    else {
      return await this.reviewModel.find();
    }
    return await this.reviewModel.find(query);
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
}
