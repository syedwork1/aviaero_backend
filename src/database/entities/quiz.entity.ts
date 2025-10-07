import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { CategoryEntity } from "./category.entity";
import { QuizAnswerEntity } from "./quiz-answer.entity";

@Entity()
export class QuizEntity extends AppBaseEntity {
  @JoinColumn()
  @ManyToOne(() => UserEntity, (student: UserEntity) => student.quiz)
  student: UserEntity;

  @JoinColumn()
  @OneToOne(() => CategoryEntity, (category: CategoryEntity) => category.quiz)
  category: CategoryEntity;

  @Column()
  status: string;

  @Column({ default: (): string => "CURRENT_TIMESTAMP" })
  startedAt: Date;

  @ManyToOne(() => QuizAnswerEntity, (answer: QuizAnswerEntity) => answer.quiz)
  answers: QuizAnswerEntity;
}
