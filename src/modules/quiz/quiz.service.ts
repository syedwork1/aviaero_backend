import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionsEntity } from "../../database/entities/question.entity";
import { In, Repository } from "typeorm";
import { QuizEntity } from "../../database/entities/quiz.entity";
import { QuizAnswerEntity } from "../../database/entities/quiz-answer.entity";
import { QuizStatus } from "@core/enums/quiz.enum";
import { StartQuizDto, SubmitQuizAnswerDto, FinishQuizDto } from "./quiz.dto";
import { ExamEntity } from "../../database/entities/exam.entity";

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuestionsEntity)
    private readonly questionRepository: Repository<QuestionsEntity>,

    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,

    @InjectRepository(QuizAnswerEntity)
    private readonly quizAnswerRepository: Repository<QuizAnswerEntity>,

    @InjectRepository(ExamEntity)
    private readonly examRepository: Repository<ExamEntity>
  ) {}

  async results(user: any) {
    const results = await this.quizRepository.query(
      `select
      count(qae.id) as total,
      sum(case when qae."selectedAnswer" is null or qae."selectedAnswer" = '' then 1 else 0 end) as skipped,
      sum(case when qae."selectedAnswer" = qu.correct_answer then 1 else 0 end) as correct,
      sum(case when qae."selectedAnswer" != qu.correct_answer then 1 else 0 end) as wrong,
      ce."name" as category,
    qe."isPractice" , qe."startedAt", qe.id 
    from
      quiz_entity qe
    left join quiz_answer_entity qae on
      qe.id = qae."quizId"
    left join questions_entity qu on
      qu.id = qae."questionId" 
    left join category_entity ce on
      ce.id = qe."categoryId" 
    where
      qe."studentId" = $1
    group by ce.name, qe."startedAt", qe."isPractice", qe.id;`,
      [user.userId]
    );

    return results.map((r) => ({
      ...r,
      marks: { total: r.total * 10, gained: r?.correct * 10 },
    }));
  }

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
        cbr_chapters,
        questions: noOfQuestion,
      } = quizData;

      const startedAt: Date = new Date();
      const quizEntity = this.quizRepository.create({
        startedAt,
        isPractice: isPractice,
        student: { id: studentId },
        status: QuizStatus.INPROGRESS,
        ...(categoryId ? { category: { id: categoryId } } : {}),
        ...(examId ? { exam: { id: examId } } : {}),
      });
      let exam: ExamEntity | null;
      if (examId) {
        exam = await this.examRepository.findOne({
          where: { id: examId },
          relations: ["CBR_chapters"],
        });
      }
      const quiz = await this.quizRepository.save(quizEntity);
      const questions = await this.questionRepository.find({
        ...(exam?.CBR_chapters?.length
          ? {
              where: {
                CBR_chapter: In(exam?.CBR_chapters?.map((c) => c.CBR_chapter)),
              },
            }
          : {}),
        select: [
          "id",
          "question",
          "explanation",
          "option_A",
          "option_B",
          "option_C",
          "option_D",
        ],
        take: exam?.number_of_questions ?? noOfQuestion ?? 15,
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
      if (!quiz.isPractice) {
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
      }
      const question = await this.questionRepository.findOne({
        where: { id: questionId },
      });
      if (!question) {
        throw new BadRequestException(`Question with id ${quizId} not found`);
      }

      const existedAnswer = await this.quizAnswerRepository.findOne({
        where: { question: { id: questionId }, quiz: { id: quizId } },
      });

      if (existedAnswer) {
        await this.quizAnswerRepository.update(
          { question: { id: questionId }, quiz: { id: quizId } },
          { selectedAnswer }
        );
      } else {
        await this.quizAnswerRepository.save({
          question,
          selectedAnswer,
          quiz: { id: quizId },
        });
      }

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
