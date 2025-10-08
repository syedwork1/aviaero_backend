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
import { SubmitQuizAnswerDto } from "./dto/submit-answer.dto";

@ApiTags("quiz")
@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard)
  @Post("start")
  start(@Body() body: StartQuizDto) {
    return this.quizService.start(body);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard)
  @Post("submit-answer")
  submitAnswer(@Body() body: SubmitQuizAnswerDto) {
    return this.quizService.submitAnswer(body);
  }
}
