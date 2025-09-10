
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

    async getPerformanceReport(from?: string, to?: string) {
        const cacheKey = { type: 'performance', from: from || '', to: to || '' };
        let cached;
        try {
            cached = await this.reportCacheModel.findOne(cacheKey).sort({ createdAt: -1 });
        } catch (err) {
            throw new InternalServerErrorException('Failed to access report cache. Please try again later.');
        }
        if (cached) {
            const createdAt = cached.get('createdAt') as Date;
            if (Date.now() - createdAt.getTime() < this.CACHE_PERIOD_MS) {
                if (Date.now() - createdAt.getTime() < this.RATE_LIMIT_PERIOD_MS) {
                    throw new BadRequestException('You have recently requested this report. Please wait a minute before trying again.');
                }
                return cached.data;
            }
        }
        let reviews;
        try {
            reviews = await this.reviewService.findAll();
        } catch (err) {
            throw new InternalServerErrorException('Failed to retrieve patient reviews for report generation.');
        }
        let data;
        try {
            data = await this.generatePerformanceReport(reviews);
        } catch (err) {
            throw new InternalServerErrorException(err.message || 'Failed to generate performance report. Please try again later.');
        }
        try {
            await this.reportCacheModel.create({ ...cacheKey, data });
        } catch (err) {
            // Don't block report delivery if caching fails
            return data;
        }
        return data;
    }

    async getComplaintsReport(from?: string, to?: string) {
        const cacheKey = { type: 'complaints', from: from || '', to: to || '' };
        let cached;
        try {
            cached = await this.reportCacheModel.findOne(cacheKey).sort({ createdAt: -1 });
        } catch (err) {
            throw new InternalServerErrorException('Failed to access report cache. Please try again later.');
        }
        if (cached) {
            const createdAt = cached.get('createdAt') as Date;
            if (Date.now() - createdAt.getTime() < this.CACHE_PERIOD_MS) {
                if (Date.now() - createdAt.getTime() < this.RATE_LIMIT_PERIOD_MS) {
                    throw new BadRequestException('You have recently requested this report. Please wait a minute before trying again.');
                }
                return cached.data;
            }
        }
        let reviews;
        try {
            reviews = await this.reviewService.findAll();
        } catch (err) {
            throw new InternalServerErrorException('Failed to retrieve patient reviews for report generation.');
        }
        let data;
        try {
            data = await this.generateComplaintsReport(reviews);
        } catch (err) {
            throw new InternalServerErrorException(err.message || 'Failed to generate complaints report. Please try again later.');
        }
        try {
            await this.reportCacheModel.create({ ...cacheKey, data });
        } catch (err) {
            // Don't block report delivery if caching fails
            return data;
        }
        return data;
    }

    private async generatePerformanceReport(reviews: any[]) {
        const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length) : 0;
        const feedbacks = reviews.map(r => r.feedback).join('\n');
        const prompt = [
            'Analyze these patient reviews for overall hospital performance. Provide:',
            '1. Overall sentiment (positive, negative, or mixed, with reasoning).',
            '2. Notable trends or patterns.',
            '3. Suggestions for improvement.',
            '',
            'Patient feedbacks:',
            feedbacks
        ].join('\n');
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: this.openaiModel,
                    messages: [
                        { role: 'system', content: 'You are a healthcare analytics expert. Analyze the following patient reviews for overall hospital performance and provide actionable insights for management.' },
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
            if (!data.choices || !data.choices[0]?.message?.content) {
                throw new Error('AI response was incomplete or malformed.');
            }
            return {
                averageRating: avgRating,
                totalReviews: reviews.length,
                aiSummary: data.choices[0].message.content,
            };
        } catch (error) {
            let message = 'Failed to generate performance report with OpenAI.';
            if (error.response && error.response.data) {
                message += ' Details: ' + JSON.stringify(error.response.data);
            } else if (error.message) {
                message += ' Details: ' + error.message;
            }
            throw new InternalServerErrorException(message);
        }
    }

    private async generateComplaintsReport(reviews: any[]) {
        const feedbacks = reviews.map(r => r.feedback).join('\n');
        const prompt = [
            'From the following patient feedbacks, list:',
            '1. The most recurring complaints (if any).',
            '2. The most recurring suggestions for improvement (if any).',
            '3. Any notable trends or patterns.',
            '',
            'Patient feedbacks:',
            feedbacks
        ].join('\n');
        try {
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
            if (!data.choices || !data.choices[0]?.message?.content) {
                throw new Error('AI response was incomplete or malformed.');
            }
            return {
                recurringComplaints: data.choices[0].message.content,
            };
        } catch (error) {
            let message = 'Failed to generate complaints report with OpenAI.';
            if (error.response && error.response.data) {
                message += ' Details: ' + JSON.stringify(error.response.data);
            } else if (error.message) {
                message += ' Details: ' + error.message;
            }
            throw new InternalServerErrorException(message);
        }
    }
}
