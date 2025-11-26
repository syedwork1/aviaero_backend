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
import {
    StartQuizDto,
    SubmitQuizAnswerDto,
    FinishQuizDto,
    ResultQueryDto,
} from "./quiz.dto";
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
import { PlansUsageService } from "../plans/plan-usage.service";

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
        private readonly courseRepository: Repository<CourceEntity>,

        private readonly planUsageRepository: PlansUsageService
    ) {}

    async findAll(page: number, limit: number, type: string, user: any) {
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
            // order: { [sortBy]: "DESC" },
        });

        return { data, total, page, limit, };
    }

    // -------------------------------------------------------------------------
    //                          UPDATED RESULTS METHOD
    // -------------------------------------------------------------------------
    async results(query: ResultQueryDto, user: any) {
        const page = query.page ?? 0;
        const limit = query.limit ?? 10;
        // const sortBy = query.sort_by ?? "startedAt";
        const resultType = query.result_type === "true"; // true=exam, false=practice

        const offset = page * limit;

        const raw = await this.quizRepository.query(
            `
      SELECT
          COUNT(qae.id) AS total,
          SUM(CASE WHEN qae."selectedAnswer" IS NULL OR qae."selectedAnswer" = '' THEN 1 ELSE 0 END) AS skipped,
          SUM(CASE WHEN qae."selectedAnswer" = qu.correct_answer THEN 1 ELSE 0 END) AS correct,
          SUM(
              CASE
                  WHEN (qae."selectedAnswer" IS NULL OR qae."selectedAnswer" != '')
                       AND qae."selectedAnswer" != qu.correct_answer THEN 1
                  ELSE 0
              END
          ) AS wrong,
          ce."name" AS category,
          ee."name" AS exam,
          qe."isPractice",
          qe."startedAt",
          qe.id
      FROM quiz_entity qe
          LEFT JOIN quiz_answer_entity qae ON qe.id = qae."quizId"
          LEFT JOIN questions_entity qu ON qu.id = qae."questionId"
          LEFT JOIN category_entity ce ON ce.id = qe."categoryId"
          LEFT JOIN exam_entity ee ON ee.id = qe."examId"
      WHERE qe."studentId" = $1
      GROUP BY ce.name, qe."startedAt", qe."isPractice", qe.id, ee.name
      
      LIMIT ${limit}
      OFFSET ${offset}
      `,
            [user.userId]
        );

        const formatted = raw.map((r) => ({
            ...r,
            marks: {
                total: Number(r.total) * 10,
                gained: Number(r.correct) * 10,
            },
        }));

        const filtered = formatted.filter((item) => {
            const isPractice = item.isPractice === true || item.isPractice === "true";
            return resultType ? !isPractice : isPractice;
        });

        return {
            data: filtered,
            page,
            limit,
            // sort_by: sortBy,
            result_type: resultType,
            count: filtered.length,
        };
    }
    // -------------------------------------------------------------------------

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

        const { categoryId, questions: noOfQuestion } = quizData;
        const startedAt = new Date();

        const quizEntity = this.quizRepository.create({
            startedAt,
            isPractice: true,
            student: { id: req.user.userId },
            status: QuizStatus.INPROGRESS,
            category: { id: categoryId },
        });

        const quiz = await this.quizRepository.save(quizEntity);

        const category = await this.categoryRepository.findOne({
            where: { id: categoryId },
        });

        const questions = await this.questionRepository.find({
            ...(category ? { where: { CBR_chapter: category.CBR_chapter } } : {}),
            select: ["id", "question", "option_A", "option_B", "option_C", "option_D"],
            take: noOfQuestion ?? 15,
        });

        const quizQuestion = questions.map((q) =>
            this.quizAnswerRepository.create({ question: q, quiz })
        );

        await this.quizAnswerRepository.save(quizQuestion);

        await this.planUsageRepository.increment(
            req.user.userId,
            req.requiredFeature
        );

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

        if (!quiz) throw new BadRequestException(RESOURCE_NOT_FOUND);
        if (!quiz.isPractice) throw new BadRequestException(EXAM_NOT_RESUMED_ERROR);

        if (
            quiz.status === QuizStatus.COMPLETED ||
            quiz.status === QuizStatus.TIMEOUT
        ) {
            throw new BadRequestException(`Quiz already ${quiz.status}!`);
        }

        const questions = quiz.answers.map(({ selectedAnswer, question }) => ({
            id: question.id,
            question: question.question,
            option_A: question.option_A,
            option_B: question.option_B,
            option_C: question.option_C,
            option_D: question.option_D,
            selectedAnswer,
            skipped: selectedAnswer === "SKIPPED",
            isCorrect:
                selectedAnswer &&
                selectedAnswer !== "SKIPPED" &&
                selectedAnswer === question.correct_answer,
            correctAnswer: selectedAnswer ? question.correct_answer : null,
            explaination:
                selectedAnswer && selectedAnswer !== "SKIPPED"
                    ? question.explanation
                    : null,
        }));

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
        if (!quiz)
            throw new BadRequestException(`Quiz with id ${quizId} not found`);

        const question = await this.questionRepository.findOne({
            where: { id: questionId },
        });
        if (!question)
            throw new BadRequestException(`Question with id ${quizId} not found`);

        const existed = await this.quizAnswerRepository.findOne({
            where: { question: { id: questionId }, quiz: { id: quizId } },
        });

        if (existed) {
            await this.quizAnswerRepository.update(
                { question: { id: questionId }, quiz: { id: quizId } },
                { selectedAnswer }
            );
        } else {
            await this.quizAnswerRepository.save({
                question,
                quiz: { id: quizId },
                selectedAnswer,
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
            if (!quiz) throw new BadRequestException(`Quiz not found with id ${quizId}`);

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
                `
        SELECT
             COUNT(qae.id) AS total,
             SUM(CASE WHEN qae."selectedAnswer" IS NULL OR qae."selectedAnswer" = '' THEN 1 ELSE 0 END) AS skipped,
             SUM(CASE WHEN qae."selectedAnswer" = qu.correct_answer THEN 1 ELSE 0 END) AS correct,
             SUM(
                 CASE WHEN (qae."selectedAnswer" IS NULL OR qae."selectedAnswer" != '')
                      AND qae."selectedAnswer" != qu.correct_answer THEN 1
                 ELSE 0
             END
             ) AS wrong,
             ee."name" AS exam
         FROM quiz_entity qe
             LEFT JOIN quiz_answer_entity qae ON qe.id = qae."quizId"
             LEFT JOIN questions_entity qu ON qu.id = qae."questionId"
             LEFT JOIN category_entity ce ON ce.id = qe."categoryId"
             LEFT JOIN exam_entity ee ON ee.id = qe."examId"
         WHERE qe."id" = $1
         GROUP BY ce.name, qe."startedAt", qe."isPractice", qe.id, ee.name;
        `,
                [quizId]
            );

            return {
                ...quiz,
                ...result,
                marks: {
                    total: result.total * 10,
                    gained: result.correct * 10,
                },
            };
        } catch (err) {
            throw new BadRequestException(err.message);
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

            return subject && subject.id === subjectId;
        }

        const requiredFeature = req.plan.features.find(
            (f) => f.name === req.requiredFeature
        );
        if (!requiredFeature) return false;

        if (!requiredFeature.limited) return true;

        const usage = await this.planUsageRepository.currentUsage(
            req.user.userId,
            req.requiredFeature
        );

        return usage < requiredFeature.limit;
    }
}
