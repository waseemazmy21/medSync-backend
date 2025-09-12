
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReviewModule } from '../review/review.module';
import { ReportCache, ReportCacheSchema } from './schemas/ReportCache.schema';

@Module({
  imports: [
    ReviewModule,
    MongooseModule.forFeature([
      { name: ReportCache.name, schema: ReportCacheSchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
