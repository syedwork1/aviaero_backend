import { forwardRef, Global, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../database/entities/user.entity";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { ConfigModule } from "@nestjs/config";
import { UserService } from "../user/services/user.service";
import { MailService } from "./services/mail.service";
import { PlansModule } from "../plans/plans.module";
import { StudentsModule } from "../students/students.module";
import { StudentEntity } from "../../database/entities/student.entity";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, StudentEntity]),
    ConfigModule,
    forwardRef(() => PlansModule),
    StudentsModule,
  ],
  providers: [AuthService, JwtService, UserService, MailService],
  controllers: [AuthController],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
