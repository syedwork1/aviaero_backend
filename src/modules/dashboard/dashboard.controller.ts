import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { Role } from "@core/enums/role.enum";
import { Roles } from "@core/decorators/roles.decorator";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { RolesGuard } from "@core/gaurds/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RequestWithUser } from "@core/types/RequestWithUser";

ApiTags("dashboard");
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin")
  admin() {
    return this.dashboardService.admin();
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @Get("student")
  student(@Req() req: RequestWithUser) {
    return this.dashboardService.student(req);
  }
}
