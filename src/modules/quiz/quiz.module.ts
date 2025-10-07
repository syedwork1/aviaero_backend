import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionsEntity } from "../../database/entities/question.entity";
import { QuizController } from "./quiz.controller";
import { QuizService } from "./quiz.service";

@Module({
  imports: [TypeOrmModule.forFeature([QuestionsEntity])],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
