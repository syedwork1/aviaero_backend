import { Request } from "express";
import { SubscriptionEntity } from "../../database/entities/subscription.entity";
import { UserEntity } from "../../database/entities/user.entity";
import { PlanEntity } from "../../database/entities/plan.entity";

export type RequestWithUser = Request & {
  user: UserEntity;
  subscription: SubscriptionEntity;
  plan: PlanEntity;
};
