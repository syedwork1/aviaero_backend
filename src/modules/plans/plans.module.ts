import { Module } from "@nestjs/common";
import { PlansService } from "./plans.service";
import { PlansController } from "./plans.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlanEntity } from "../../database/entities/plan.entity";
import { AuthModule } from "../auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { CourcesModule } from "../cources/cources.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanEntity]),
    AuthModule,
    ConfigModule,
    CourcesModule,
  ],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
