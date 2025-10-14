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
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { StartQuizDto, SubmitQuizAnswerDto, FinishQuizDto } from "./quiz.dto";

@ApiTags("quiz")
@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard)
  @Get("results")
  resutls(@Req() req) {
    return this.quizService.results(req.user);
  }

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  get(@Param("id") quizId: string) {
    return this.quizService.getQuiz(quizId);
  }

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

  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard)
  @Post("finish")
  finish(@Body() body: FinishQuizDto) {
    return this.quizService.finish(body);
  }
}
