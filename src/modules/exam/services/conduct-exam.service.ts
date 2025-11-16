import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionsEntity } from "../../../database/entities/question.entity";
import { In, Repository } from "typeorm";
import { QuizEntity } from "../../../database/entities/quiz.entity";
import { QuizAnswerEntity } from "../../../database/entities/quiz-answer.entity";
import { QuizStatus } from "@core/enums/quiz.enum";
import { ExamEntity } from "../../../database/entities/exam.entity";
import { CategoryEntity } from "../../../database/entities/category.entity";
import { IPlanFeature, RequestWithUser } from "@core/types/RequestWithUser";
import { FinishExamDto, StartExamDto, SubmitExamAnswerDto } from "../exam.dto";

@Injectable()
export class ConductExamService {
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

  async start(quizData: StartExamDto, req: RequestWithUser) {
    if (
      !(await this.canStartExam(
        req.requiredFeature,
        req.user.userId,
        quizData.examId
      ))
    ) {
      throw new ForbiddenException("Resource allowed limit reached");
    }
    const { examId } = quizData;
    const startedAt: Date = new Date();

    const quizEntity = this.quizRepository.create({
      startedAt,
      isPractice: false,
      student: { id: req.user.userId },
      status: QuizStatus.INPROGRESS,
      exam: { id: examId },
    });

    const exam: ExamEntity = await this.examRepository.findOne({
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
      isPractice: false,
      quizId: quiz.id,
    };
  }

  async submitAnswer(answerData: SubmitExamAnswerDto) {
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  isWithin60Min = (date: Date | string): boolean => {
    return Date.now() - new Date(date).getTime() <= 60 * 60 * 1000;
  };

  async finish(quizData: FinishExamDto) {
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

  async canStartExam(
    requiredFeature: IPlanFeature,
    userId: string,
    examId: string
  ) {
    if (!requiredFeature.limited) {
      return true;
    }
    const subjectExam = await this.examRepository.findOne({
      where: { id: examId },
      relationLoadStrategy: "join",
      relations: ["course"],
    });
    console.log(subjectExam);
    const subjectExams = await this.examRepository.find({
      where: { course: { id: subjectExam.course.id } },
    });
    const userExamCount = await this.quizRepository.count({
      where: {
        student: { id: userId },
        exam: { id: In(subjectExams.map((e) => e.id)) },
      },
    });
    console.log(userExamCount, "userExamCount");
    if (userExamCount < requiredFeature.limit) {
      return true;
    }

    return false;
  }
}
