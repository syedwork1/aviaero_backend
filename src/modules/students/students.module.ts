import { Module } from "@nestjs/common";
import { StudentsService } from "./students.service";
import { StudentsController } from "./students.controller";
import { UserService } from "../user/services/user.service";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../database/entities/user.entity";
import { StudentEntity } from "../../database/entities/student.entity";
import { SchoolsModule } from "../schools/schools.module";
import { QuizEntity } from "../../database/entities/quiz.entity";

@Module({
  imports: [
    UserModule,
    SchoolsModule,
    TypeOrmModule.forFeature([UserEntity, StudentEntity, QuizEntity]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService, UserService],
  exports: [StudentsService],
})
export class StudentsModule {}
