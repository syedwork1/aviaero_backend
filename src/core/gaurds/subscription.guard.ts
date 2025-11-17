import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PlansService } from "../../modules/plans/plans.service";
import { Role } from "@core/enums/role.enum";
import { Reflector } from "@nestjs/core";
import { REQUIRE_FEATURE_KEY } from "@core/decorators/feature-require.decorator";
import {
  SUBSCRIPTION_EXPIRED,
  SUBSCRIPTION_REQUIRED,
} from "@core/constants/errors";

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly planService: PlansService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeatureCode = this.reflector.get<string>(
      REQUIRE_FEATURE_KEY,
      context.getHandler()
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { userId } = user;

    if (!userId) {
      throw new ForbiddenException("User id not found!");
    }

    const subscription = await this.planService.getUserSubscription(userId);

    if (!subscription) {
      throw new ForbiddenException(SUBSCRIPTION_REQUIRED);
    }

    if (subscription.expireAt < new Date()) {
      throw new ForbiddenException(SUBSCRIPTION_EXPIRED);
    }

    request.subscription = subscription;
    request.plan = subscription.plan;
    request.requiredFeature = requiredFeatureCode;

    return true;
  }
}
