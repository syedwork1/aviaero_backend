import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { CategoryEntity } from "./category.entity";
import { QuizEntity } from "./quiz.entity";
import { QuestionsEntity } from "./question.entity";

@Entity()
export class QuizAnswerEntity extends AppBaseEntity {
  @JoinColumn()
  @ManyToOne(() => QuizEntity, (quiz: QuizEntity) => quiz.answers)
  quiz: QuizEntity;

  @JoinColumn()
  @ManyToOne(
    () => QuestionsEntity,
    (question: QuestionsEntity) => question.quizAnswer
  )
  question: QuestionsEntity;

  @Column()
  selectedAnswer: string;
}
