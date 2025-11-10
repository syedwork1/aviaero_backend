import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { CreateExamDto } from "../dto/create-exam.dto";
import { UpdateExamDto } from "../dto/update-exam.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Any, In, Repository } from "typeorm";
import { ExamEntity } from "../../../database/entities/exam.entity";
import { CategoryEntity } from "../../../database/entities/category.entity";

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(ExamEntity)
    private readonly examRepository: Repository<ExamEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}
  async create(createExamDto: CreateExamDto, userId: string) {
    const { CBR_chapters, coursesId, questionIds, ...examData } = createExamDto;
    const exam = this.examRepository.create({
      ...examData,
      course: { id: coursesId },
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
    query: string,
    subjectId: string
  ): Promise<{
    data: ExamEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let cbrs = [];
    if (subjectId) {
      cbrs = await this.categoryRepository.find({
        where: { cource: { id: subjectId } },
      });
    }
    const [data, total] = await this.examRepository.findAndCount({
      ...(subjectId
        ? { where: { CBR_chapters: { id: In(cbrs.map((cbr) => cbr.id)) } } }
        : {}),
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
