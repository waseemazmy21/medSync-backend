
import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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


    async getDepartmentReport(departmentId: string, from?: string, to?: string) {
        const cacheKey = { type: 'department', department: departmentId || '', from: from || '', to: to || '' };
        // let cached;
        // try {
        //     cached = await this.reportCacheModel.findOne(cacheKey).sort({ createdAt: -1 });
        // } catch (err) {
        //     throw new InternalServerErrorException('Failed to access report cache. Please try again later.');
        // }
        // if (cached) {
        //     const createdAt = cached.get('createdAt') as Date;
        //     if (Date.now() - createdAt.getTime() < this.CACHE_PERIOD_MS) {
        //         if (Date.now() - createdAt.getTime() < this.RATE_LIMIT_PERIOD_MS) {
        //             throw new BadRequestException('You have recently requested this report. Please wait a minute before trying again.');
        //         }
        //         return cached;
        //     }
        // }

        let reviews;
        try {
            reviews = await this.reviewService.findByDepartment(departmentId)
        } catch (err) {
            throw new InternalServerErrorException('Failed to retrieve patient reviews for report generation.');
        }
        let report;
        try {
            report = await this.generateDepartmentReport(reviews);
        } catch (err) {
            throw new InternalServerErrorException(err.message || 'Failed to generate department report. Please try again later.');
        }
        try {
            await this.reportCacheModel.create({ ...cacheKey, ...report });
        } catch (err) {
            // Don't block report delivery if caching fails
            return report;
        }
        return report;
    }

    private async generateDepartmentReport(reviews: any[]): Promise<{
        overview: string;
        pros: string[];
        cons: string[];
        totalReviews: number;
        averageRating: number;
    }> {
        const feedbacks = reviews.map(r => r.feedback).join('\n');
        const prompt = [
            'Analyze these patient reviews for this department. Provide:',
            '1. A concise overview (1-2 sentences).',
            '2. A list of pros (positive points, as bullet points).',
            '3. A list of cons (negative points, as bullet points).',
            'format the output as json with the following structure:',
            '{"overview": "...", "pros": ["..."], "cons": ["..."],}',
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
                        { role: 'system', content: 'You are a healthcare analytics expert. Analyze the following patient reviews for a hospital department and provide a structured report.' },
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


            const content = data.choices[0].message.content;

            const match = content.match(/```json\s*([\s\S]*?)\s*```/);

            if (!match) {
                throw new Error("No JSON block found in markdown");
            }

            console.log('--------------------------------');
            console.log(match[1]);
            console.log('--------------------------------');

            const report = JSON.parse(match[1]);


            const overview = report.overview || '';
            const pros = report.pros || [];
            const cons = report.cons || [];

            return {
                overview,
                pros,
                cons,
                totalReviews: reviews.length,
                averageRating: reviews.length ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length) : 0,
            };

        } catch (error) {
            console.log(error);
            // Always return the correct structure, even on error
            return {
                overview: 'Failed to generate report.',
                pros: [],
                cons: [],
                totalReviews: reviews.length,
                averageRating: reviews.length ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length) : 0,
            };
        }
    }
}
