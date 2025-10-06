import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  stats() {
    return {
      total: {
        students: 1,
        enrollments: 1,
        courses: 1,
        quizes: 1,
      },
      feedback: {
        three_starts: 4,
        four_stars: 5,
        five_stars: 5,
      },
      courseCompletion: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 12, 1, 11, 22, 12],
    };
  }
}
