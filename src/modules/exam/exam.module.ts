import { Module } from "@nestjs/common";
import { ExamService } from "./services/exam.service";
import { ExamController } from "./controllers/exam.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExamEntity } from "../../database/entities/exam.entity";
import { ConfigModule } from "@nestjs/config";
import { QuestionsService } from "../questions/services/questions.service";
import { QuestionsEntity } from "../../database/entities/question.entity";
import { CategoryModule } from "../category/category.module";
import { ExamBulkCreationService } from "./services/bulk.service";
import { CategoryEntity } from "../../database/entities/category.entity";
import { QuestionReportEntity } from "../../database/entities/question-report.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExamEntity,
      QuestionsEntity,
      CategoryEntity,
      QuestionReportEntity,
    ]),
    ConfigModule,
    CategoryModule,
  ],

  controllers: [ExamController],
  providers: [ExamService, QuestionsService, ExamBulkCreationService],
})
export class ExamModule {}
