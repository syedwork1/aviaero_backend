import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamQuestionsService } from '../services/exam-questions.service';
import { CreateExamQuestionDto } from '../dto/create-exam-question.dto';
import { UpdateExamQuestionDto } from '../dto/update-exam-question.dto';

@Controller('exam-questions')
export class ExamQuestionsController {
  constructor(private readonly examQuestionsService: ExamQuestionsService) {}

  @Post()
  create(@Body() createExamQuestionDto: CreateExamQuestionDto) {
    return this.examQuestionsService.create(createExamQuestionDto);
  }

  @Get()
  findAll() {
    return this.examQuestionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examQuestionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamQuestionDto: UpdateExamQuestionDto) {
    return this.examQuestionsService.update(+id, updateExamQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examQuestionsService.remove(+id);
  }
}
