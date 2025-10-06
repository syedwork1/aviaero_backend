import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@core/enums/role.enum";
import { Roles } from "@core/gaurds/roles.decorator";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { RolesGuard } from "@core/gaurds/roles.guard";

@ApiTags("dashboard")
@Controller("dashboard")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  stats() {
    return this.appService.stats();
  }
}
