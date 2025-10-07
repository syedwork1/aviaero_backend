import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionsEntity } from "../../database/entities/question.entity";
import { Repository } from "typeorm";
import { PracticeQuizDto } from "./dto/practice.dto";

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuestionsEntity)
    private readonly questionRepository: Repository<QuestionsEntity>
  ) {}

  practice(body: PracticeQuizDto) {
    return this.questionRepository.find({
      select: [
        "id",
        "question",
        "explanation",
        "option_A",
        "option_B",
        "option_C",
        "option_D",
      ],
      take: 15,
    });
  }
}
