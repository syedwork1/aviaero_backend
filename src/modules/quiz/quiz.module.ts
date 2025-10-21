import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionsEntity } from "../../database/entities/question.entity";
import { QuizController } from "./quiz.controller";
import { QuizService } from "./quiz.service";
import { QuizEntity } from "../../database/entities/quiz.entity";
import { QuizAnswerEntity } from "../../database/entities/quiz-answer.entity";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
import { ExamEntity } from "../../database/entities/exam.entity";

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([
      QuestionsEntity,
      QuizEntity,
      QuizAnswerEntity,
      ExamEntity,
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
