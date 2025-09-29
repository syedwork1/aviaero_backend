import { Module } from "@nestjs/common";
import { StudentsService } from "./students.service";
import { StudentsController } from "./students.controller";
import { UserService } from "../user/services/user.service";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../database/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  controllers: [StudentsController],
  providers: [StudentsService, UserService],
})
export class StudentsModule {}
