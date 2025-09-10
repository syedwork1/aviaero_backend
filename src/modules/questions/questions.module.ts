import { Module } from '@nestjs/common';
import { QuestionsService } from './services/questions.service';
import { QuestionsController } from './controllers/questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsEntity } from '../../database/entities/question.entity';
import { ConfigModule } from '@nestjs/config';
@Module({
  
  imports: [TypeOrmModule.forFeature([QuestionsEntity]), ConfigModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
