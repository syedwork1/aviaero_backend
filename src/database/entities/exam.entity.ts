import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { QuizEntity } from "./quiz.entity";
import { CategoryEntity } from "./category.entity";
import { CourceEntity } from "./cource.entity";
import { QuestionsEntity } from "./question.entity";

@Entity()
export class ExamEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column()
  number_of_questions: number;

  @Column()
  difficulty: string;

  @Column()
  time: number;

  @ManyToMany(() => CategoryEntity)
  @JoinTable()
  CBR_chapters: CategoryEntity[];

  @ManyToMany(() => CourceEntity)
  @JoinTable()
  courses: CourceEntity[];

  @ManyToMany(() => QuestionsEntity)
  @JoinTable()
  questions: QuestionsEntity[];

  @OneToMany(() => QuizEntity, (feedback) => feedback.exam)
  quizes: QuizEntity;
}
