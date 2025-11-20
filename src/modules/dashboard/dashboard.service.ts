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
      // {
      //   three_starts: 4,
      //   four_stars: 5,
      //   five_stars: 5,
      // },
      // courseCompletion: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 12, 1, 11, 22, 12],
    };
  }

  async student(req: RequestWithUser) {
    let totalExam = 0,
      totalQuizes = 0;
    const quizes = await this.quizRepository.find({
      where: { student: { id: req.user.userId } },
    });
    for (const quiz of quizes) {
      if (quiz.isPractice) {
        totalQuizes += 1;
      } else {
        totalExam += 1;
      }
    }

    return {
      totalExam,
      totalQuizes,
    };
    // return {
    //   total: {
    //     subject: 1,
    //     exam: 1,
    //     quiz: 1,
    //   },
    //   courses: [
    //     { name: "course", progress: 89 },
    //     { name: "course", progress: 89 },
    //     { name: "course", progress: 89 },
    //     { name: "course", progress: 89 },
    //   ],
    //   exams: [
    //     { name: "exam ", passingMarks: 80, practiceMarks: 55 },
    //     { name: "exam ", passingMarks: 80, practiceMarks: 55 },
    //     { name: "exam ", passingMarks: 80, practiceMarks: 55 },
    //     { name: "exam ", passingMarks: 80, practiceMarks: 55 },
    //     { name: "exam ", passingMarks: 80, practiceMarks: 55 },
    //     { name: "exam ", passingMarks: 80, practiceMarks: 55 },
    //     { name: "exam ", passingMarks: 80, practiceMarks: 55 },
    //     { name: "exam ", passingMarks: 80, practiceMarks: 55 },
    //     { name: "exam ", passingMarks: 80, practiceMarks: 55 },
    //     { name: "exam ", passingMarks: 80, practiceMarks: 55 },
    //     { name: "exam ", passingMarks: 80, practiceMarks: 55 },
    //     { name: "exam ", passingMarks: 80, practiceMarks: 55 },
    //   ],
    // };
  }
}
