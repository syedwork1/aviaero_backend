import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuizEntity } from "../../database/entities/quiz.entity";
import { Repository } from "typeorm";
import { FeedbackEntity } from "../../database/entities/feedback.entity";
import { ExamEntity } from "../../database/entities/exam.entity";
import { StudentEntity } from "../../database/entities/student.entity";
import { CourceEntity } from "../../database/entities/cource.entity";
import { RequestWithUser } from "@core/types/RequestWithUser";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,
    @InjectRepository(ExamEntity)
    private readonly examRepository: Repository<ExamEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(CourceEntity)
    private readonly coursesRepository: Repository<CourceEntity>,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>
  ) {}

  async admin() {
    const students = await this.studentRepository.count();
    const courses = await this.coursesRepository.count();
    const quizes = await this.quizRepository.count();
    const exams = await this.examRepository.count();
    const feedback = await this.feedbackRepository
      .createQueryBuilder("f")
      .select([
        `SUM(CASE WHEN f.rating = 3 THEN 1 ELSE 0 END) AS three_stars`,
        `SUM(CASE WHEN f.rating = 4 THEN 1 ELSE 0 END) AS four_stars`,
        `SUM(CASE WHEN f.rating = 5 THEN 1 ELSE 0 END) AS five_stars`,
      ])
      .getRawOne();
    return {
      total: {
        students,
        exams,
        courses,
        quizes,
      },
      feedback,
      courseCompletion: [],
    };
  }

  async student(req: RequestWithUser) {
    let totalExams = 0,
      totalQuizzes = 0,
      totalSubjects = {},
      exams = [];
    const quizzes = await this.quizRepository.find({
      where: { student: { id: req.user.userId } },
      relationLoadStrategy: "join",
      relations: ["answers", "exam", "exam.course", "answers.question"],
    });
    for (const quiz of quizzes) {
      if (quiz.isPractice) {
        totalQuizzes += 1;
      } else {
        totalExams += 1;
        if (
          quiz?.exam?.course?.id &&
          totalSubjects[quiz?.exam?.course?.id] === undefined
        ) {
          totalSubjects[quiz?.exam?.course?.id] = 1;
        } else if (quiz?.exam?.course?.id) {
          totalSubjects[quiz?.exam?.course?.id]++;
        }
        exams.push({
          name: quiz.exam.name,
          passingMarks: quiz.exam.number_of_questions * 10,
          practiceMarks: quiz.answers.reduce((marks, answer) => {
            if (answer.selectedAnswer === answer.question.correct_answer) {
              return (marks += 1);
            }
            return marks;
          }, 0),
        });
      }
    }
    return {
      total: {
        subject: Object.keys(totalSubjects).length,
        exam: totalExams,
        quiz: totalQuizzes,
      },
      exams,
      // [
      //   { name: "exam ", passingMarks: 80, practiceMarks: 55 },
      //   { name: "exam ", passingMarks: 80, practiceMarks: 55 },
      //   { name: "exam ", passingMarks: 80, practiceMarks: 55 },
      //   { name: "exam ", passingMarks: 80, practiceMarks: 55 },
      //   { name: "exam ", passingMarks: 80, practiceMarks: 55 },
      //   { name: "exam ", passingMarks: 80, practiceMarks: 55 },
      //   { name: "exam ", passingMarks: 80, practiceMarks: 55 },
      //   { name: "exam ", passingMarks: 80, practiceMarks: 55 },
      //   { name: "exam ", passingMarks: 80, practiceMarks: 55 },
      //   { name: "exam ", passingMarks: 80, practiceMarks: 55 },
      //   { name: "exam ", passingMarks: 80, practiceMarks: 55 },
      //   { name: "exam ", passingMarks: 80, practiceMarks: 55 },
      // ],
    };
  }
}
