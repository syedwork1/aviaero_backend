import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PlansService } from "../../modules/plans/plans.service";
import { Role } from "@core/enums/role.enum";

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly planService: PlansService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { userId, role } = user;
    if (role && role === Role.ADMIN) {
      return true;
    }
    if (!userId) {
      throw new ForbiddenException("User id not found!");
    }
    const subscription = await this.planService.getUserSubscription(userId);

    if (!subscription) {
      throw new ForbiddenException(
        "You don't have subscription to access this feature!"
      );
    }

    if (subscription.expireAt < new Date()) {
      throw new ForbiddenException("Subscription expired!");
    }

    request.subscription = subscription;
    request.plan = subscription.plan;
    return true;
  }
}
