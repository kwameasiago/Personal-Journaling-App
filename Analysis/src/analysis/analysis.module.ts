import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { Journals } from 'src/entities/journal.entity';
import { serviceEvent } from 'src/entities/serviceEvent.entity';
import { WordCount } from 'src/entities/wordCount.entity';
import { Tags } from 'src/entities/tags.entity';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';


@Module({
  imports: [
    RabbitMQModule.forRoot({uri: process.env.RABBITMQ_URI || 'amqp://user:password@localhost:5672'}),
    TypeOrmModule.forFeature([Journals, serviceEvent, WordCount, Tags])
  ],
  providers: [AnalysisService],
  controllers: [AnalysisController]
})
export class AnalysisModule {}
