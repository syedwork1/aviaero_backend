import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionsEntity } from "../../database/entities/question.entity";
import { In, Repository } from "typeorm";
import { QuizEntity } from "../../database/entities/quiz.entity";
import { QuizAnswerEntity } from "../../database/entities/quiz-answer.entity";
import { QuizStatus } from "@core/enums/quiz.enum";
import { StartQuizDto, SubmitQuizAnswerDto, FinishQuizDto } from "./quiz.dto";
import { ExamEntity } from "../../database/entities/exam.entity";
import { QuizType } from "./quiz.enum";
import { Role } from "@core/enums/role.enum";
import { CategoryEntity } from "../../database/entities/category.entity";

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
    private readonly examRepository: Repository<ExamEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    type: string,
    user: any
  ) {
    const [data, total] = await this.quizRepository.findAndCount({
      where: {
        isPractice: type === QuizType.exam ? false : true,
        ...(user.role === Role.STUDENT ? { student: { id: user.userId } } : {}),
      },
      select: { category: { id: true, name: true, CBR_chapter: true } },
      relations: ["category"],
      relationLoadStrategy: "join",
      take: limit,
      skip: page * limit || 0,
      order: {
        [sortBy]: "DESC",
      },
    });

    return { data, total, page, limit, sortBy };
  }

  async results(user: any) {
    const results = await this.quizRepository.query(
      `select
      count(qae.id) as total,
      sum(case when qae."selectedAnswer" is null or qae."selectedAnswer" = '' then 1 else 0 end) as skipped,
      sum(case when qae."selectedAnswer" = qu.correct_answer then 1 else 0 end) as correct,
      sum(case when (qae."selectedAnswer" is null or qae."selectedAnswer" != '') and qae."selectedAnswer" != qu.correct_answer then 1 else 0 end) as wrong,
      ce."name" as category,
      ee."name" as exam,
    qe."isPractice" , qe."startedAt", qe.id 
    from
      quiz_entity qe
    left join quiz_answer_entity qae on
      qe.id = qae."quizId"
    left join questions_entity qu on
      qu.id = qae."questionId" 
    left join category_entity ce on
      ce.id = qe."categoryId" 
    left join exam_entity ee on
      ee.id = qe."examId" 
    where
      qe."studentId" = $1
    group by ce.name, qe."startedAt", qe."isPractice", qe.id, ee.name;`,
      [user.userId]
    );

    return results.map((r) => ({
      ...r,
      exam: r?.exam ?? "Practice",
      marks: {
        total: r.total * 10,
        gained: r?.correct * 10,
      },
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
        categoryId,
        studentId,
        examId,
        questions: noOfQuestion,
      } = quizData;
      const isPractice = !Boolean(examId);

      const startedAt: Date = new Date();
      const quizEntity = this.quizRepository.create({
        startedAt,
        isPractice,
        student: { id: studentId },
        status: QuizStatus.INPROGRESS,
        ...(categoryId ? { category: { id: categoryId } } : {}),
        ...(examId ? { exam: { id: examId } } : {}),
      });
      if (examId) {
        let exam: ExamEntity | null;
        exam = await this.examRepository.findOne({
          where: { id: examId },
          select: {
            questions: {
              id: true,
              question: true,
              option_A: true,
              option_B: true,
              option_C: true,
              option_D: true,
            },
          },
          relations: ["CBR_chapters", "questions"],
        });
        const quiz = await this.quizRepository.save(quizEntity);
        return {
          questions: exam?.questions,
          startedAt,
          isPractice,
          categoryId,
          quizId: quiz.id,
        };
      }
      const quiz = await this.quizRepository.save(quizEntity);
      if (!categoryId) {
        throw new BadRequestException("category id is required");
      }
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      const questions = await this.questionRepository.find({
        ...(category ? { where: { CBR_chapter: category.CBR_chapter } } : {}),
        select: [
          "id",
          "question",
          "option_A",
          "option_B",
          "option_C",
          "option_D",
        ],
        take: noOfQuestion ?? 15,
      });
      return { questions, startedAt, isPractice, categoryId, quizId: quiz.id };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async continue(quizId: string) {
    const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
    if (!quiz) {
      throw new BadRequestException(`Quiz with id ${quizId} not found`);
    }
    if (quiz.exam) {
      throw new BadRequestException(`Exam cannot be resumed!`);
    }
    if (
      quiz.status === QuizStatus.COMPLETED ||
      quiz.status === QuizStatus.TIMEOUT
    ) {
      throw new BadRequestException(`Quiz already ${quiz.status}!`);
    }

    const questions = await this.questionRepository.find({
      ...(quiz?.category?.CBR_chapter
        ? { where: { CBR_chapter: quiz?.category?.CBR_chapter } }
        : {}),
      select: [
        "id",
        "question",
        "option_A",
        "option_B",
        "option_C",
        "option_D",
      ],
      take: 15,
    });
    return {
      questions,
      startedAt: quiz.startedAt,
      isPractice: quiz.isPractice,
      quizId: quiz.id,
    };
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
          (quiz.exam && quiz.status === QuizStatus.COMPLETED) ||
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
        explaination: question.explanation,
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
        (quiz.exam && quiz.status === QuizStatus.COMPLETED) ||
        quiz.status === QuizStatus.TIMEOUT
      ) {
        throw new BadRequestException(`Quiz already ${quiz.status}!`);
      }

      await this.quizRepository.update(
        { id: quizId },
        { status: QuizStatus.COMPLETED }
      );

      const [result] = await this.quizRepository.query(
        `select
      count(qae.id) as total,
      sum(case when qae."selectedAnswer" is null or qae."selectedAnswer" = '' then 1 else 0 end) as skipped,
      sum(case when qae."selectedAnswer" = qu.correct_answer then 1 else 0 end) as correct,
      sum(case when (qae."selectedAnswer" is null or qae."selectedAnswer" != '') and qae."selectedAnswer" != qu.correct_answer then 1 else 0 end) as wrong,
      ee."name" as exam
    from
      quiz_entity qe
    left join quiz_answer_entity qae on
      qe.id = qae."quizId"
    left join questions_entity qu on
      qu.id = qae."questionId" 
    left join category_entity ce on
      ce.id = qe."categoryId" 
    left join exam_entity ee on
      ee.id = qe."examId" 
    where
      qe."id" = $1
    group by ce.name, qe."startedAt", qe."isPractice", qe.id, ee.name;`,
        [quizId]
      );

      return {
        ...quiz,
        ...result,
        marks: {
          total: result.total * 10,
          gained: result?.correct * 10,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
