import { Injectable } from "@nestjs/common";
import { CreateQuestionDto } from "../dto/create-question.dto";
import { UpdateQuestionDto } from "../dto/update-question.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionsEntity } from "../../../database/entities/question.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import * as fastCsv from "fast-csv";
import { Readable } from "stream";
import { CategoryService } from "../../category/services/category.service";

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionsEntity)
    private readonly questionRepository: Repository<QuestionsEntity>,
    private readonly categoryService: CategoryService
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<{
    success: boolean;
    message: string;
    data?: QuestionsEntity;
  }> {
    try {
      const category = await this.categoryService.findOne(
        createQuestionDto.categoryId
      );

      if (!category) {
        throw new NotFoundException(
          `Category with id ${createQuestionDto.categoryId} not found!`
        );
      }
      const savedQuestion = await this.questionRepository.save({
        ...createQuestionDto,
        Mobility: category,
      });

      return {
        success: true,
        message: "Question created successfully",
        data: savedQuestion,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to create question",
      };
    }
  }

  async findAll(
    page = 1,
    limit = 10
  ): Promise<{
    success: boolean;
    message: string;
    data?: QuestionsEntity[];
    total?: number;
    page?: number;
    limit?: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.questionRepository.find({
          relations: ["Mobility"],
          skip,
          take: limit,
          order: { createAt: "DESC" },
        }),
        this.questionRepository.count(),
      ]);

      return {
        success: true,
        message: "Questions fetched successfully",
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to fetch questions ",
      };
    }
  }

  async findOne(id: string): Promise<{
    success: boolean;
    message: string;
    data?: QuestionsEntity;
  }> {
    try {
      const question = await this.questionRepository.findOne({
        where: { id },
        relations: ["Mobility"],
      });

      if (!question) {
        return {
          success: false,
          message: `Question with id ${id} not found`,
        };
      }

      return {
        success: true,
        message: "Question fetched successfully",
        data: question,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to fetch question ",
      };
    }
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto
  ): Promise<{
    success: boolean;
    message: string;
    data?: QuestionsEntity;
  }> {
    try {
      const question = await this.questionRepository.findOne({ where: { id } });

      if (!question) {
        throw new NotFoundException(`Question with id ${id} not found`);
      }

      let category: any;

      if ("categoryId" in updateQuestionDto) {
        category = await this.categoryService.findOne(
          updateQuestionDto.categoryId
        );

        if (!category) {
          throw new NotFoundException(
            `Category with id ${updateQuestionDto.categoryId} not found!`
          );
        }
      }

      Object.assign(question, updateQuestionDto);
      return {
        success: true,
        message: "Question updated successfully",
        data: await this.questionRepository.save({
          ...question,
          ...(category ? { category } : {}),
        }),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to update question",
      };
    }
  }

  async remove(id: string): Promise<{
    success: boolean;
    message: string;
    data?: QuestionsEntity;
  }> {
    try {
      const question = await this.questionRepository.findOne({ where: { id } });

      if (!question) {
        throw new NotFoundException(`Question with id ${id} not found`);
      }

      await this.questionRepository.remove(question);

      return {
        success: true,
        message: "Question removed successfully ",
        data: question,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to remove question",
      };
    }
  }

  async readCsvFromBuffer(buffer: any): Promise<any> {
    return new Promise<{ data: any[]; errors: string[] }>((resolve, reject) => {
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);
      const data: any[] = [];
      const errors: string[] = [];
      let headers: string[] = [];

      stream
        .pipe(
          fastCsv.parse({
            headers: true,
          })
        )
        .on("headers", (h: string[]) => {
          headers = h.map((header) => header.trim());
        })
        .on("data", (row) => {
          if (!headers.length) return;
          const rowData: any = {};
          let isValid = true;

          headers.forEach((header) => {
            const value = row[header] || null;
            rowData[header] = value;
          });

          if (isValid) {
            data.push(rowData);
          }
        })
        .on("end", () => {
          resolve({ data, errors });
        })
        .on("error", reject);
    });
  }

  async upload(file: Express.Multer.File) {
    const {
      headers,
      data: rows,
      errors,
    } = await this.readCsvFromBuffer(file.buffer);

    const toNull = (v: any) =>
      v === undefined || v === null || v === "" ? null : v;
    //  console.log(rows,"rows")
    const mapped = rows.map((r) => {
      return {
        question: toNull(r["Vraag"]),
        option_A: toNull(r["antwoord A"]),
        option_B: toNull(r["Antwoord B"]),
        option_C: toNull(r["Antwoord C"]),
        option_D: toNull(r["Antwoord D"]),
        correct_answer: toNull(r["Correct antwoord"]),
        explanation: toNull(r["Uitleg"]),
        Mobility: toNull(r["Categorie"]),
        difficulty: toNull(r["Moeilijkheid"]),
        CBR_chapter: toNull(r["CBR-code"]),
      };
    });
    console.log(mapped, "mapped");
    return this.questionRepository.save(mapped);
  }

  // find Random Questions
  async findRandomQuestions(
    CBR_chapter: string,
    difficulty: string,
    number_of_questions: number
  ): Promise<QuestionsEntity[]> {
    const getQuestions = await this.questionRepository.find({
      where: { CBR_chapter, difficulty },
      take: number_of_questions,
    });

    if (!getQuestions.length) {
      return [];
    }

    return getQuestions;
  }
}
