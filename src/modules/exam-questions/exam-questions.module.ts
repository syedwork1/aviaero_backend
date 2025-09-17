import { Module } from '@nestjs/common';
import { ExamQuestionsService } from '../exam-questions/services/exam-questions.service';
import { ExamQuestionsController } from './controllers/exam-questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import{ExamQuestionEntity} from '../../database/entities/exam-question.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ExamQuestionEntity]), ConfigModule],
  controllers: [ExamQuestionsController],
  providers: [ExamQuestionsService],
})
export class ExamQuestionsModule {}
