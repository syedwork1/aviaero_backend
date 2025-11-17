import { Request } from "express";
import { SubscriptionEntity } from "../../database/entities/subscription.entity";
import { PlanEntity } from "../../database/entities/plan.entity";
import { Role } from "@core/enums/role.enum";
import { FeaturesListEnum } from "@core/enums/features.enum";

export interface IPlanFeature {
  limit: number;
  limited: boolean;
  name: string;
}

export interface IJWTPayload {
  name: string;
  email: string;
  userId: string;
  role: Role;
}

export type RequestWithUser = Request & {
  user: IJWTPayload;
  subscription: SubscriptionEntity;
  plan: PlanEntity;
  requiredFeature?: FeaturesListEnum;
};
