import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("app")
@Controller("app")
export class AppController {
  @Get("ping")
  ping() {
    return "pong";
  }
}
