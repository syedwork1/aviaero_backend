import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { QuizService } from "./quiz.service";
import { StartQuizDto } from "./dto/start-quiz.dto";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { RolesGuard } from "@core/gaurds/roles.guard";
import { Roles } from "@core/gaurds/roles.decorator";
import { Role } from "@core/enums/role.enum";

@ApiTags("quiz")
@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard)
  @Post("start")
  practice(@Body() body: StartQuizDto) {
    return this.quizService.start(body);
  }
}
