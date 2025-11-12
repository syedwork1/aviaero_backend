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
    try {
      const user = request.user;
      const { userId } = user;
      if (!userId) {
        throw new ForbiddenException("user id not found!");
      }
      // if (role === Role.ADMIN) {
      //   return true;
      // }
      const subscription = await this.planService.getUserSubscription(userId);
      request.user.subscription = subscription;
      return true;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }
}
