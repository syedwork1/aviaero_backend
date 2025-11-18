import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionsEntity } from "../../database/entities/question.entity";
import { Repository } from "typeorm";
import { QuizEntity } from "../../database/entities/quiz.entity";
import { QuizAnswerEntity } from "../../database/entities/quiz-answer.entity";
import { QuizStatus } from "@core/enums/quiz.enum";
import { StartQuizDto, SubmitQuizAnswerDto, FinishQuizDto } from "./quiz.dto";
import { QuizType } from "./quiz.enum";
import { Role } from "@core/enums/role.enum";
import { CategoryEntity } from "../../database/entities/category.entity";
import { RequestWithUser } from "@core/types/RequestWithUser";
import { PlanTypeEnum } from "@core/enums/plan.enum";
import { CourceEntity } from "../../database/entities/cource.entity";
import {
  EXAM_NOT_RESUMED_ERROR,
  RESOURCE_NOT_ALLOWED_ERROR,
  RESOURCE_NOT_FOUND,
} from "@core/constants/errors";

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuestionsEntity)
    private readonly questionRepository: Repository<QuestionsEntity>,

    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,

    @InjectRepository(QuizAnswerEntity)
    private readonly quizAnswerRepository: Repository<QuizAnswerEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(CourceEntity)
    private readonly courseRepository: Repository<CourceEntity>
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
      exam: "Practice",
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

  async start(quizData: StartQuizDto, req: RequestWithUser) {
    if (!(await this.canStartQuiz(req, quizData.categoryId))) {
      throw new ForbiddenException(RESOURCE_NOT_ALLOWED_ERROR);
    }
    const { categoryId, studentId, questions: noOfQuestion } = quizData;
    const startedAt: Date = new Date();
    const quizEntity = this.quizRepository.create({
      startedAt,
      isPractice: true,
      student: { id: studentId },
      status: QuizStatus.INPROGRESS,
      category: { id: categoryId },
    });
    const quiz = await this.quizRepository.save(quizEntity);
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

    const quizQuestion = questions.map((question) =>
      this.quizAnswerRepository.create({ question, quiz })
    );
    await this.quizAnswerRepository.save(quizQuestion);

    return {
      questions,
      startedAt,
      isPractice: true,
      categoryId,
      quizId: quiz.id,
    };
  }

  async continue(quizId: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relationLoadStrategy: "join",
      relations: ["answers", "answers.question", "category"],
    });
    if (!quiz) {
      throw new BadRequestException(RESOURCE_NOT_FOUND);
    }
    if (!quiz.isPractice) {
      throw new BadRequestException(EXAM_NOT_RESUMED_ERROR);
    }
    if (
      quiz.status === QuizStatus.COMPLETED ||
      quiz.status === QuizStatus.TIMEOUT
    ) {
      throw new BadRequestException(`Quiz already ${quiz.status}!`);
    }
    const questions = quiz.answers.map(
      ({
        id: answerId,
        selectedAnswer,
        question: {
          id,
          question,
          option_A,
          option_B,
          option_C,
          option_D,
          correct_answer,
          explanation,
        },
      }) => {
        const questionData: {
          id: string;
          question: string;
          option_A: string;
          option_B: string;
          option_C: string;
          option_D: string;
          selectedAnswer: string;
          skipped?: boolean;
          isCorrect?: boolean;
          correctAnswer?: string;
          explaination?: string;
        } = {
          id,
          question,
          option_A,
          option_B,
          option_C,
          option_D,
          selectedAnswer,
        };
        if (selectedAnswer === "SKIPPED") {
          questionData.skipped = true;
        } else if (selectedAnswer) {
          questionData.skipped = false;
          questionData.isCorrect = selectedAnswer === correct_answer;
          questionData.correctAnswer = correct_answer;
          questionData.explaination = explanation;
        }

        return questionData;
      }
    );
    return {
      questions: questions.reverse(),
      startedAt: quiz.startedAt,
      isPractice: quiz.isPractice,
      categoryId: quiz?.category?.id,
      quizId: quiz.id,
    };
  }

  async submitAnswer(answerData: SubmitQuizAnswerDto) {
    const { questionId, quizId, selectedAnswer } = answerData;
    const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
    if (!quiz) {
      throw new BadRequestException(`Quiz with id ${quizId} not found`);
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
    if (selectedAnswer === "SKIPPED") {
      return {
        skipped: true,
        isCorrect: null,
        correctAnswer: null,
        explaination: null,
        questionId,
      };
    }

    return {
      skipped: false,
      isCorrect: selectedAnswer === question.correct_answer,
      correctAnswer: question.correct_answer,
      explaination: question.explanation,
      questionId,
    };
  }

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

  async canStartQuiz(req: RequestWithUser, categoryId: string) {
    const plan = req.plan;
    if (plan.type === PlanTypeEnum.SUBJECT) {
      const subjectId = plan.subject.id;

      const subject = await this.courseRepository.findOne({
        where: { category: { id: categoryId } },
        relationLoadStrategy: "join",
        relations: ["category"],
      });

      if (subject && subject.id === subjectId) {
        return true;
      }

      return false;
    }

    const requiredFeature = req.plan.features.find(
      (feature) => feature.name === req.requiredFeature
    );

    if (!requiredFeature) {
      return false;
    }

    if (!requiredFeature.limited) {
      return true;
    }

    const userQuizCount = await this.quizRepository.count({
      where: { student: { id: req.user.userId } },
    });
    if (userQuizCount < requiredFeature.limit) {
      return true;
    }

    return false;
  }
}
