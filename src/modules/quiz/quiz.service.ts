import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionsEntity } from "../../database/entities/question.entity";
import { Repository } from "typeorm";
import { QuizEntity } from "../../database/entities/quiz.entity";
import { QuizAnswerEntity } from "../../database/entities/quiz-answer.entity";
import { QuizStatus } from "@core/enums/quiz.enum";
import { StartQuizDto, SubmitQuizAnswerDto, FinishQuizDto } from "./quiz.dto";

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

  getQuiz(quizId: string) {
    return this.quizRepository
      .createQueryBuilder("quiz")
      .leftJoinAndSelect("quiz.category", "category")
      .leftJoinAndSelect("quiz.student", "student")
      .leftJoinAndSelect("quiz.answers", "answers")
      .leftJoinAndSelect("answers.question", "question")
      .where("quiz.id = :quizId", { quizId })
      .select([
        "quiz.id",
        "quiz.status",
        "quiz.isPractice",
        "quiz.startedAt",
        "category.id",
        "category.CBR_chapter",
        "student.id",
        "student.firstName",
        "student.lastName",
        "student.email",
        "answers.selectedAnswer",
        "question.id",
        "question.question",
        "question.option_A",
        "question.option_B",
        "question.option_C",
        "question.option_D",
        "question.correct_answer",
        "question.explanation",
        "question.img_1",
        "question.img_2",
      ])
      .getOne();
  }

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
      const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
      if (!quiz) {
        throw new BadRequestException(`Quiz with id ${quizId} not found`);
      }
      if (
        quiz.status === QuizStatus.COMPLETED ||
        quiz.status === QuizStatus.TIMEOUT
      ) {
        throw new BadRequestException(`Quiz already ${quiz.status}!`);
      }

      if (!this.isWithin60Min(quiz.startedAt)) {
        await this.quizRepository.update(
          { id: quizId },
          { status: QuizStatus.TIMEOUT }
        );
        throw new BadRequestException("Quiz timeout!");
      }
      const question = await this.questionRepository.findOne({
        where: { id: questionId },
      });
      if (!question) {
        throw new BadRequestException(`Question with id ${quizId} not found`);
      }
      const answerEntity = this.quizAnswerRepository.create({
        question,
        selectedAnswer,
        quiz: { id: quizId },
      });

      await this.quizAnswerRepository.save(answerEntity);

      return {
        skipped: !selectedAnswer,
        isCorrect: selectedAnswer === question.correct_answer,
        correctAnswer: question.correct_answer,
        questionId,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  isWithin60Min = (date: Date | string): boolean => {
    return Date.now() - new Date(date).getTime() <= 60 * 60 * 1000;
  };

  async finish(quizData: FinishQuizDto) {
    try {
      const { quizId } = quizData;

      const quiz = await this.getQuiz(quizId);

      if (!quiz) {
        throw new BadRequestException(`Quiz not found with id ${quizId}`);
      }

      if (
        quiz.status === QuizStatus.COMPLETED ||
        quiz.status === QuizStatus.TIMEOUT
      ) {
        throw new BadRequestException(`Quiz already ${quiz.status}!`);
      }

      await this.quizRepository.update(
        { id: quizId },
        { status: QuizStatus.COMPLETED }
      );

      return quiz;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
