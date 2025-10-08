import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionsEntity } from "../../database/entities/question.entity";
import { Repository } from "typeorm";
import { StartQuizDto } from "./dto/start-quiz.dto";
import { QuizEntity } from "../../database/entities/quiz.entity";
import { QuizAnswerEntity } from "../../database/entities/quiz-answer.entity";
import { QuizStatus } from "@core/enums/quiz.enum";
import { SubmitQuizAnswerDto } from "./dto/submit-answer.dto";
import { FinishQuizDto } from "./dto/finish-quiz.dto";

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuestionsEntity)
    private readonly questionRepository: Repository<QuestionsEntity>,

    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,

    @InjectRepository(QuizAnswerEntity)
    private readonly quizAnswerRepository: Repository<QuizAnswerEntity>
  ) {}

  async start(quizData: StartQuizDto) {
    try {
      const {
        isPractice,
        categoryId,
        studentId,
        examId,
        questions: noOfQuestion,
      } = quizData;
      const startedAt: Date = new Date();
      const quizEntity = this.quizRepository.create({
        startedAt,
        isPractice: isPractice,
        student: { id: studentId },
        status: QuizStatus.INPROGRESS,
        category: { id: categoryId },
        ...(examId ? { exam: { id: examId } } : {}),
      });
      const quiz = await this.quizRepository.save(quizEntity);
      const questions = await this.questionRepository.find({
        select: [
          "id",
          "question",
          "explanation",
          "option_A",
          "option_B",
          "option_C",
          "option_D",
        ],
        take: noOfQuestion ?? 15,
      });
      return { questions, startedAt, isPractice, quizId: quiz.id };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async submitAnswer(answerData: SubmitQuizAnswerDto) {
    try {
      const { questionId, quizId, selectedAnswer } = answerData;
      const answerEntity = this.quizAnswerRepository.create({
        question: { id: questionId },
        selectedAnswer,
        quiz: { id: quizId },
      });
      const answer = await this.quizAnswerRepository.save(answerEntity);
      const question = await this.questionRepository.findOne({
        where: { id: questionId },
      });

      return {
        isCorrect: selectedAnswer === question.correct_answer,
        correctAnswer: question.correct_answer,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async finish(quizData: FinishQuizDto) {
    try {
      const { quizId } = quizData;

      return this.quizRepository.update(
        { id: quizId },
        { status: QuizStatus.COMPLETED }
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
