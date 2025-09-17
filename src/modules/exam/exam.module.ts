import { Module } from '@nestjs/common';
import { ExamService } from './services/exam.service';
import { ExamController } from './controllers/exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamEntity } from '../../database/entities/exam.entity';
import { ConfigModule } from '@nestjs/config';
import {QuestionsService} from '../questions/services/questions.service'
import {QuestionsEntity} from '../../database/entities/question.entity'
import {ExamQuestionsService} from '../exam-questions/services/exam-questions.service'
import {ExamQuestionEntity} from '../../database/entities/exam-question.entity'

@Module({
   imports: [TypeOrmModule.forFeature([ExamEntity,QuestionsEntity,ExamQuestionEntity]), ConfigModule],

  controllers: [ExamController],
  providers: [ExamService,QuestionsService,ExamQuestionsService],
})
export class ExamModule {}
