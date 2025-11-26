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
import { CategoryEntity } from "../../database/entities/category.entity";
import { CourceEntity } from "../../database/entities/cource.entity";
import { PlansModule } from "../plans/plans.module";   // <-- REQUIRED

@Module({
    imports: [
        ConfigModule,
        AuthModule,
        PlansModule,   // <-- FIXED
        TypeOrmModule.forFeature([
            QuestionsEntity,
            QuizEntity,
            QuizAnswerEntity,
            ExamEntity,
            CategoryEntity,
            CourceEntity,
        ]),
    ],
    controllers: [QuizController],
    providers: [QuizService],
})
export class QuizModule {}
