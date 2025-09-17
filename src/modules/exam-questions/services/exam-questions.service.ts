import { Injectable } from '@nestjs/common';
import { CreateExamQuestionDto } from '../dto/create-exam-question.dto';
import { UpdateExamQuestionDto } from '../dto/update-exam-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { ExamQuestionEntity } from '../../../database/entities/exam-question.entity';

@Injectable()
export class ExamQuestionsService {
    constructor(
              @InjectRepository(ExamQuestionEntity)
              private readonly ExamQuestionEntityRepository: Repository<ExamQuestionEntity>,
            ) {}


async savedStudentExamQuestions(questionId:string,examId:string): Promise<ExamQuestionEntity>{
 
  const savedExamQuestions={
    questionId:questionId,
    examId:examId
  }
return await this.ExamQuestionEntityRepository.save(savedExamQuestions)

  }




  create(createExamQuestionDto: CreateExamQuestionDto) {
    return 'This action adds a new examQuestion';
  }

  findAll() {
    return `This action returns all examQuestions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examQuestion`;
  }

  update(id: number, updateExamQuestionDto: UpdateExamQuestionDto) {
    return `This action updates a #${id} examQuestion`;
  }

  remove(id: number) {
    return `This action removes a #${id} examQuestion`;
  }
}
