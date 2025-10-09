import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { CategoryEntity } from "./category.entity";
import { ExamEntity } from "./exam.entity";
import { SubjectEntity } from "./subject.entity";
import { QuizEntity } from "./quiz.entity";

@Entity()
export class FeedbackEntity extends AppBaseEntity {
  @Column()
  feedback: string;

  @Column()
  rating: number;

  @ManyToOne(() => UserEntity, (student: UserEntity) => student.feedback)
  @JoinColumn()
  student: UserEntity;

  @ManyToOne(() => QuizEntity, (quiz: QuizEntity) => quiz.feedback)
  @JoinColumn()
  quiz: QuizEntity;
}
