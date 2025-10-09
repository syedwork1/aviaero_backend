import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { CourceEntity } from "../entities/cource.entity";
import { QuestionsEntity } from "./question.entity";
import { FeedbackEntity } from "./feedback.entity";
import { QuizEntity } from "./quiz.entity";

@Entity()
export class CategoryEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  CBR_chapter: string;

  @OneToMany(() => CourceEntity, (cource) => cource.category, {})
  cource: CourceEntity;

  @OneToMany(() => QuestionsEntity, (question) => question.Mobility, {})
  questions: QuestionsEntity;

  @OneToOne(() => QuizEntity, (question) => question.category, {})
  quiz: QuizEntity;
}
