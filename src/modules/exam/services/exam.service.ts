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

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(ExamEntity)
    private readonly examRepository: Repository<ExamEntity>
  ) {}
  async create(createExamDto: CreateExamDto, userId: string) {
    const { CBR_chapters, coursesIds, questionIds, ...examData } =
      createExamDto;
    const exam = this.examRepository.create({
      ...examData,
      courses: coursesIds.map((cid) => ({ id: cid })),
      CBR_chapters: CBR_chapters.map((cbr) => ({ id: cbr })),
      questions: questionIds.map((q) => ({ id: q })),
    });
    const savedExam = await this.examRepository.save(exam);

    return savedExam;
  }
  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    query: string
  ): Promise<{
    data: ExamEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const [data, total] = await this.examRepository.findAndCount({
      relationLoadStrategy: "join",
      relations: ["CBR_chapters", "courses"],
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
