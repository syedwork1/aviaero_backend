import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { QuizService } from "./quiz.service";
import { PracticeQuizDto } from "./dto/practice.dto";

@ApiTags("quiz")
@Controller("quiz")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  practice(@Body() body: PracticeQuizDto) {
    return this.quizService.practice(body);
  }
}
