import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewService } from '../review/review.service';
import axios from 'axios';
import { ReportCache, ReportCacheDocument } from './schemas/ReportCache.schema';

@Injectable()
export class ReportsService {
    private readonly openaiApiKey: string;
    private readonly openaiModel: string;
    private readonly CACHE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000; // 1 week
    private readonly RATE_LIMIT_PERIOD_MS = 60 * 1000; // 1 minute per unique report

    constructor(
        @InjectModel(ReportCache.name) private readonly reportCacheModel: Model<ReportCacheDocument>,
        private readonly reviewService: ReviewService,
    ) {
        this.openaiApiKey = process.env.OPENAI_API_KEY || '';
        this.openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    }

    async getRecurringComplaints(from?: string, to?: string) {
        const cacheKey = { type: 'complaints', from: from || '', to: to || '' };
        const cached = await this.reportCacheModel.findOne(cacheKey).sort({ createdAt: -1 });
        if (cached) {
            const createdAt = cached.get('createdAt') as Date;
            if (Date.now() - createdAt.getTime() < this.CACHE_PERIOD_MS) {
                if (Date.now() - createdAt.getTime() < this.RATE_LIMIT_PERIOD_MS) {
                    throw new BadRequestException('Please wait before requesting this report again.');
                }
                return cached.data;
            }
        }
        const reviews = await this.reviewService.findAllWithPeriod(from, to);
        const data = await this.extractRecurringComplaints(reviews);
        await this.reportCacheModel.create({ ...cacheKey, data });
        return data;
    }

    async analyzeDoctorReviews(reviews: any[]) {
        const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
        const feedbacks = reviews.map(r => r.feedback).join('\n');
        try {
            const prompt = [
                'Analyze these patient reviews for a doctor. Provide:',
                '1. Overall sentiment (positive, negative, or mixed, with reasoning).',
                '2. Most common complaints (if any).',
                '3. Most common suggestions for improvement (if any).',
                '4. Notable trends or patterns.',
                '',
                'Patient feedbacks:',
                feedbacks
            ].join('\n');
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: this.openaiModel,
                    messages: [
                        { role: 'system', content: 'You are a healthcare analytics expert. Analyze the following patient reviews for a specific doctor and provide actionable insights for hospital management.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 400,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.openaiApiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = response.data as any;
            return {
                averageRating: avgRating,
                totalReviews: reviews.length,
                aiSummary: data.choices[0].message.content,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to analyze doctor reviews with OpenAI');
        }
    }

    async analyzeDepartmentReviews(reviews: any[]) {
        const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
        const feedbacks = reviews.map(r => r.feedback).join('\n');
        try {
            const prompt = [
                'Analyze these patient reviews for a department. Provide:',
                '1. Overall sentiment (positive, negative, or mixed, with reasoning).',
                '2. Most common complaints (if any).',
                '3. Most common suggestions for improvement (if any).',
                '4. Notable trends or patterns.',
                '',
                'Patient feedbacks:',
                feedbacks
            ].join('\n');
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: this.openaiModel,
                    messages: [
                        { role: 'system', content: 'You are a healthcare analytics expert. Analyze the following patient reviews for a specific department and provide actionable insights for hospital management.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 400,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.openaiApiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = response.data as any;
            return {
                averageRating: avgRating,
                totalReviews: reviews.length,
                aiSummary: data.choices[0].message.content,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to analyze department reviews with OpenAI');
        }
    }

    async extractRecurringComplaints(reviews: any[]) {
        const feedbacks = reviews.map(r => r.feedback).join('\n');
        try {
            const prompt = [
                'From the following patient feedbacks, list:',
                '1. The most recurring complaints (if any).',
                '2. The most recurring suggestions for improvement (if any).',
                '3. Any notable trends or patterns.',
                '',
                'Patient feedbacks:',
                feedbacks
            ].join('\n');
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: this.openaiModel,
                    messages: [
                        { role: 'system', content: 'You are a world-class healthcare data analyst. Your job is to extract actionable recurring complaints and suggestions from patient reviews.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 300,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.openaiApiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = response.data as any;
            return {
                recurringComplaints: data.choices[0].message.content,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to extract recurring complaints with OpenAI');
        }
    }

    async getDoctorPerformance(doctorId: string, from?: string, to?: string) {
        if (!doctorId) throw new BadRequestException('doctorId is required');
        const reviews = await this.reviewService.findByDoctorWithPeriod(doctorId, from, to);
        return this.analyzeDoctorReviews(reviews);
    }

    async getDepartmentPerformance(departmentId: string, from?: string, to?: string) {
        if (!departmentId) throw new BadRequestException('departmentId is required');
        const reviews = await this.reviewService.findByDepartmentWithPeriod(departmentId, from, to);
        return this.analyzeDepartmentReviews(reviews);
    }
}
