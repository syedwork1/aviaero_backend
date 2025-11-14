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
    if (!userId) {
      throw new ForbiddenException("user id not found!");
    }
    if (role && role === Role.ADMIN) {
      return true;
    }
    const subscription = await this.planService.getUserSubscription(userId);

    if (subscription.expireAt < new Date()) {
      throw new ForbiddenException("Subscription expired!");
    }

    request.subscription = subscription;
    request.plan = subscription.plan;
    return true;
  }
}
