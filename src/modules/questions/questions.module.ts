import { Module } from "@nestjs/common";
import { QuestionsService } from "./services/questions.service";
import { QuestionsController } from "./controllers/questions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionsEntity } from "../../database/entities/question.entity";
import { ConfigModule } from "@nestjs/config";
import { CategoryModule } from "../category/category.module";
import { CategoryEntity } from "../../database/entities/category.entity";
import { QuestionReportEntity } from "../../database/entities/question-report.entity";
import { PlansModule } from "../plans/plans.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionsEntity,
      CategoryEntity,
      QuestionReportEntity,
    ]),
    ConfigModule,
    CategoryModule,
    PlansModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
