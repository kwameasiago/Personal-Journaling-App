import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';
import { Tags } from 'src/entities/tags.entity';
import { Journal } from 'src/entities/journals.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tags, Journal])
  ],
  controllers: [JournalsController],
  providers: [JournalsService]
})
export class JournalsModule {}
