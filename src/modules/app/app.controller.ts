import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role } from "@core/enums/role.enum";
import { Roles } from "@core/gaurds/roles.decorator";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { RolesGuard } from "@core/gaurds/roles.guard";
import { SESService } from "@core/providers/ses.service";

@ApiTags("dashboard")
@Controller("dashboard")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sesService: SESService
  ) {}

  @Get("ping")
  ping() {
    return "pong";
  }

  @Get("mail")
  mail() {
    return this.sesService.sendEmail("a", "b");
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  admin() {
    return this.appService.stats();
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @Get("student")
  student() {
    return this.appService.stats();
  }
}
