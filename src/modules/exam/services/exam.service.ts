import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { CreateExamDto } from "../dto/create-exam.dto";
import { UpdateExamDto } from "../dto/update-exam.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExamEntity } from "../../../database/entities/exam.entity";
import { QuestionsService } from "../../questions/services/questions.service";
import { ExamQuestionsService } from "../../exam-questions/services/exam-questions.service";

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(ExamEntity)
    private readonly examRepository: Repository<ExamEntity>,
    private readonly questionSerice: QuestionsService,
    private readonly examQuestionsService: ExamQuestionsService
  ) {}
  async create(createExamDto: CreateExamDto, userId: string) {
    // const getRandomQuestions = await this.questionSerice.findRandomQuestions(
    //   createExamDto.CBR_chapter,
    //   createExamDto.difficulty,
    //   createExamDto.number_of_questions
    // );

    // if (!getRandomQuestions || getRandomQuestions.length === 0) {
    //   throw new BadRequestException(
    //     "No questions available for the given criteria."
    //   );
    // }
    const savedExamData = {
      name: createExamDto.name,
      number_of_questions: createExamDto.number_of_questions,
      difficulty: createExamDto.difficulty,
      studentId: userId,
      CBR_chapter: createExamDto.CBR_chapter,
      time: createExamDto.time,
      end_date: createExamDto.end_date,
    };
    const savedExam = await this.examRepository.save(savedExamData);

    // return getRandomQuestions.map(
    //   async (q) =>
    //     await this.examQuestionsService.savedStudentExamQuestions(
    //       q.id,
    //       savedExam.id
    //     )
    // );

    return savedExam;
  }
  async findAll(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    data: ExamEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const [data, total] = await this.examRepository.findAndCount({
      // where: { studentId: userId },
      skip: page * limit,
      take: limit,
      order: { createAt: "DESC" },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} exam`;
  }

  update(id: number, updateExamDto: UpdateExamDto) {
    return `This action updates a #${id} exam`;
  }

  remove(id: number) {
    return `This action removes a #${id} exam`;
  }
}
