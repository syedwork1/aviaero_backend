import { Injectable, BadRequestException } from "@nestjs/common";
import * as fastCsv from "fast-csv";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { ExamEntity } from "../../../database/entities/exam.entity";
import { Readable } from "typeorm/platform/PlatformTools";
import { QuestionsEntity } from "../../../database/entities/question.entity";
import { CategoryEntity } from "../../../database/entities/category.entity";

@Injectable()
export class ExamBulkCreationService {
  constructor(
    @InjectRepository(ExamEntity)
    private readonly examRepository: Repository<ExamEntity>,
    @InjectRepository(QuestionsEntity)
    private readonly questionRepository: Repository<QuestionsEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

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
            delimiter: ";",
            discardUnmappedColumns: true,
            ignoreEmpty: true,
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

  async create(rows: any, courseId: string) {
    const toNull = (v: any) =>
      v === undefined || v === null || v === "" ? null : v;

    const exams = {};
    for (const r of rows) {
      if (!toNull(r["Vraag"])) {
        continue;
      }
      if (exams[toNull(r["ExamID"])] === undefined) {
        exams[toNull(r["ExamID"])] = {
          questions: [toNull(r["Vraag"])],
          //   cbr: [toNull(r["CBR-code"])],
        };
      } else {
        exams[toNull(r["ExamID"])].questions.push(toNull(r["Vraag"]));
        // exams[toNull(r["ExamID"])].cbr.push(toNull(r["CBR-code"]));
      }
    }

    for (const key of Object.keys(exams)) {
      const questionTitles = exams[key].questions;
      //   const cbr = exams[key].cbr;
      const questions = await this.questionRepository.findBy({
        question: In(questionTitles),
      });
      //   const cbrs = await this.categoryRepository.findBy({
      //     CBR_chapter: In(cbr),
      //   });
      const exam = this.examRepository.create({
        course: { id: courseId },
        questions,
        name: key,
        number_of_questions: questions.length,
        time: 60,
        difficulty: "Normal",
      });

      await this.examRepository.save(exam);
    }
  }

  async bulkCreation(file: any, courseId: string) {
    if (!file) {
      throw new BadRequestException("Please select a CSV file.");
    }

    const expectedHeaders = [
      "ExamID",
      "QNo",
      "Vraag",
      "antwoord A",
      "Antwoord B",
      "Antwoord C",
      "Antwoord D",
      "Correct antwoord",
      "Uitleg",
      "CBR-code",
    ];

    try {
      const { data, errors } = await this.readCsvFromBuffer(file.buffer);

      if (errors.length) {
        throw new BadRequestException("Error processing CSV file.");
      }

      const headers = Object.keys(data[0] || {})?.map((h) => h.toLowerCase());
      const isValidCsv = expectedHeaders
        .map((h) => h.toLocaleLowerCase())
        .every((header) => headers.includes(header));

      // if (!isValidCsv) {
      //   throw new BadRequestException(
      //     "Invalid CSV file format. Please upload the correct CSV file."
      //   );
      // }

      const payload = await this.create(data, courseId);

      return {
        Message: "Exam created from CSV file successfully",
        payload,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        error.message || "Failed to process CSV file."
      );
    }
  }
}
