import { Injectable } from "@nestjs/common";
import { CreateQuestionDto } from "../dto/create-question.dto";
import { UpdateQuestionDto } from "../dto/update-question.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionsEntity } from "../../../database/entities/question.entity";
import { Repository, In, ILike } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import * as fastCsv from "fast-csv";
import { Readable } from "stream";
import { CategoryService } from "../../category/services/category.service";
import { CategoryEntity } from "../../../database/entities/category.entity";

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
        createQuestionDto.Mobility
      );

      if (!category) {
        throw new NotFoundException(
          `Category with id ${createQuestionDto.Mobility} not found!`
        );
      }
      delete createQuestionDto.Mobility;
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
    page: number,
    limit: number,
    sortBy: string,
    query: string
  ): Promise<{
    success: boolean;
    message: string;
    data?: QuestionsEntity[];
    total?: number;
    page?: number;
    limit?: number;
  }> {
    try {
      const [data, total] = await Promise.all([
        this.questionRepository.find({
          relations: ["Mobility"],
          ...(query ? { where: { question: ILike(`%${query}%`) } } : {}),
          skip: page * limit,
          take: limit,
          order: { [sortBy]: "DESC" },
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

      if ("Mobility" in updateQuestionDto) {
        category = await this.categoryService.findOne(
          updateQuestionDto.Mobility
        );

        if (!category) {
          throw new NotFoundException(
            `Category with id ${updateQuestionDto.Mobility} not found!`
          );
        }
      }
      delete updateQuestionDto.Mobility;
      Object.assign(question, updateQuestionDto);
      return {
        success: true,
        message: "Question updated successfully",
        data: await this.questionRepository.save({
          ...question,
          ...(category ? { Mobility: category } : {}),
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
    const { data: rows } = await this.readCsvFromBuffer(file.buffer);

    console.log(rows);
    const toNull = (v: any) =>
      v === undefined || v === null || v === "" ? null : v;

    // Step 1: Normalize rows
    const mapped = rows.map((r) => ({
      question: toNull(r["Vraag"]),
      option_A: toNull(r["antwoord A"]),
      option_B: toNull(r["Antwoord B"]),
      option_C: toNull(r["Antwoord C"]),
      option_D: toNull(r["Antwoord D"]),
      correct_answer: toNull(r["Correct antwoord"]),
      explanation: toNull(r["Uitleg"]),
      difficulty: toNull(r["Moeilijkheid"]),
      CBR_chapter: toNull(r["CBR-code"]),
      categoryName: toNull(r["Categorie"]),
    }));

    // Step 2: Extract unique categories with chapter info
    const categoryInput = new Map<
      string,
      { name: string; CBR_chapter?: string }
    >();
    for (const row of mapped) {
      if (row.categoryName && !categoryInput.has(row.categoryName)) {
        categoryInput.set(row.categoryName, {
          name: row.categoryName,
          CBR_chapter: row.CBR_chapter,
        });
      }
    }

    const categoryNames = [...categoryInput.keys()];

    // Step 3: Fetch existing categories in one go
    const { categories: existingCategories } =
      await this.categoryService.findAll({
        name: In(categoryNames),
      });

    const categoryMap = new Map<string, CategoryEntity>();
    existingCategories.forEach((cat) => categoryMap.set(cat.name, cat));

    // Step 4: Create missing categories
    const missing = categoryNames.filter((name) => !categoryMap.has(name));
    if (missing.length) {
      const savedCategories = await this.categoryService.bulkCreate(
        missing.map((name) => ({
          name,
          CBR_chapter: categoryInput.get(name)?.CBR_chapter || null,
        }))
      );
      savedCategories.forEach((cat) => categoryMap.set(cat.name, cat));
    }

    // Step 5: Build questions with category relation
    const questions = mapped.map((r) =>
      this.questionRepository.create({
        question: r.question,
        option_A: r.option_A,
        option_B: r.option_B,
        option_C: r.option_C,
        option_D: r.option_D,
        correct_answer: r.correct_answer,
        explanation: r.explanation,
        difficulty: r.difficulty,
        CBR_chapter: r.CBR_chapter,
        Mobility: categoryMap.get(r.categoryName), // ManyToOne relation
      })
    );

    // Step 6: Bulk insert questions
    return this.questionRepository.save(questions);
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
