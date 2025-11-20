import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExamEntity } from "../../database/entities/exam.entity";
import { CourceEntity } from "../../database/entities/cource.entity";
import { StudentEntity } from "../../database/entities/student.entity";
import { QuizEntity } from "../../database/entities/quiz.entity";
import { FeedbackEntity } from "../../database/entities/feedback.entity";

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([
      StudentEntity,
      ExamEntity,
      QuizEntity,
      FeedbackEntity,
      CourceEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
