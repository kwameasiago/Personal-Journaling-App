import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { Tags } from 'src/entities/tags.entity';
import { Journal } from 'src/entities/journals.entity';
import { JwtAuthGuard } from './jwt-auth-gaurd';

@Module({
  imports: [
    RabbitMQModule.forRoot({uri: process.env.RABBITMQ_URI || 'amqp://user:password@localhost:5672'}),
    TypeOrmModule.forFeature([Tags, Journal]),
    HttpModule
  ],
  controllers: [JournalsController],
  providers: [JournalsService, JwtAuthGuard]
})

export class JournalsModule {}
