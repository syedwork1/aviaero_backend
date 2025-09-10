import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { QuestionsService } from '../services/questions.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { Query } from '@nestjs/common';
import { JwtAuthGuard } from '@core/gaurds/jwt-auth.gaurd';
import { Roles } from '@core/gaurds/roles.decorator';
import { RolesGuard } from '@core/gaurds/roles.guard';
import { Role } from '@core/enums/role.enum';


@ApiTags('Questions')
@Controller('questions')

export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}



// create single question on admin side
  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/single')
  @Roles(Role.ADMIN)
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  // get all questions 
  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.STUDENT,Role.ADMIN)
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.questionsService.findAll(Number(page), Number(limit));
  }

  // get question through question Id
  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  // update the questions
  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/update/:id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  // delete the questions
  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
