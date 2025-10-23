import { forwardRef, Module } from "@nestjs/common";
import { PlansService } from "./plans.service";
import { PlansController } from "./plans.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlanEntity } from "../../database/entities/plan.entity";
import { AuthModule } from "../auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { CourcesModule } from "../cources/cources.module";
import { SubscriptionEntity } from "../../database/entities/subscription.entity";
import { StudentEntity } from "../../database/entities/student.entity";
import { MollieService } from "./mollie.service";
import { PaymentEntity } from "../../database/entities/payment.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlanEntity,
      SubscriptionEntity,
      StudentEntity,
      PaymentEntity,
    ]),
    forwardRef(() => AuthModule),
    ConfigModule,
    CourcesModule,
  ],
  controllers: [PlansController],
  providers: [PlansService, MollieService],
  exports: [PlansService],
})
export class PlansModule {}
