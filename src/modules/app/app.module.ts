import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { configService } from "../../database/config/db-config.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { QuestionsModule } from "../questions/questions.module";
import { AuthModule } from "../auth/auth.module";
import { SchoolsModule } from "../schools/schools.module";
import { SchoolStudentsModule } from "../school-students/school-students.module";
import { CategoryModule } from "../category/category.module";
import { SubjectModule } from "../subject/subject.module";
import { ExamModule } from "../exam/exam.module";
import { CourcesModule } from "../cources/cources.module";
import { StudentsModule } from "../students/students.module";
import { UploadModule } from "../upload/upload.module";
import { PlansModule } from "../plans/plans.module";
import { FeedbackModule } from "../feedback/feedback.module";
import { QuizModule } from "../quiz/quiz.module";
import { SESService } from "@core/providers/ses.service";
import { DashboardModule } from "../dashboard/dashboard.module";

@Module({
    imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        AuthModule,
        UserModule,
        QuestionsModule,
        SchoolsModule,
        SchoolStudentsModule,
        CategoryModule,
        SubjectModule,
        ExamModule,
        CourcesModule,
        StudentsModule,
        UploadModule,
        PlansModule,
        FeedbackModule,
        DashboardModule,
        QuizModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET") || "your_jwt_secret",
                signOptions: { expiresIn: "60m" },
            }),
            inject: [ConfigService],
        }),
        ConfigModule,
    ],
    controllers: [AppController],
    providers: [SESService],
})
export class AppModule {}
