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
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { QuizService } from "./quiz.service";
import { JwtAuthGuard } from "@core/gaurds/jwt-auth.gaurd";
import { StartQuizDto, SubmitQuizAnswerDto, FinishQuizDto } from "./quiz.dto";
import { QuizType } from "./quiz.enum";

@ApiTags("quiz")
@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiQuery({
    name: "page",
    type: Number,
    description: "page no",
    required: false,
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    description: "page size",
    required: false,
  })
  @ApiQuery({
    name: "sort_by",
    type: String,
    description: "sort by",
    required: false,
  })
  @ApiQuery({
    name: "type",
    enum: QuizType,
    description: "get quiz type",
    required: false,
  })
  @ApiBearerAuth("authorization")
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query("page", new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("sort_by") sortBy: string,
    @Query("type") type: string
  ) {
    return this.quizService.findAll(page, limit, sortBy, type);
  }

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
  @Get("continue/:id")
  continue(@Param("id") quizId: string) {
    return this.quizService.continue(quizId);
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
