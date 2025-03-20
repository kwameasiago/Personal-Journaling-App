import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { Journals } from 'src/entities/journal.entity';
import { serviceEvent } from 'src/entities/serviceEvent.entity';
import { WordCount } from 'src/entities/wordCount.entity';
import { Tags } from 'src/entities/tags.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Journals, serviceEvent, WordCount, Tags])
  ],
  providers: [AnalysisService],
  controllers: [AnalysisController]
})
export class AnalysisModule {}
