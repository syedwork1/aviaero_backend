import { Injectable } from "@nestjs/common";
import { CreateExamDto, UpdateExamDto } from "../exam.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExamEntity } from "../../../database/entities/exam.entity";
import { CategoryEntity } from "../../../database/entities/category.entity";
import { RequestWithUser } from "@core/types/RequestWithUser";

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
    subjectId: string,
    req: RequestWithUser
  ): Promise<{
    data: ExamEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const where: { course?: { id: string } } = {};
    if (subjectId) {
      where.course = { id: subjectId };
    }
    if (req?.plan?.subject !== null) {
      where.course = { id: req.plan.subject.id };
    }
    const [data, total] = await this.examRepository.findAndCount({
      ...(Object.keys(where).length ? { where } : {}),
      relationLoadStrategy: "join",
      relations: ["CBR_chapters", "course"],
      skip: page * limit,
      take: limit,
      order: { [sortBy]: "DESC" },
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
