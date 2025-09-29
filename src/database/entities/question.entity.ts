import { Column, Entity, ManyToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { ExamEntity } from "./exam.entity";
@Entity()
export class QuestionsEntity extends AppBaseEntity {
  @Column()
  question: string;

  @Column()
  option_A: string;

  @Column()
  option_B: string;

  @Column()
  option_C: string;

  @Column()
  option_D: string;

  @Column()
  correct_answer: string;

  @Column()
  explanation: string;

  @Column({ default: true })
  subscription_level: boolean;

  @Column({ default: true })
  is_exam_question: boolean;

  @Column({ nullable: true })
  Mobility: string;

  @Column()
  difficulty: string;

  @Column({ nullable: true })
  CBR_chapter: string;

  //  @ManyToOne(() => ExamEntity, (exam) => exam.questions, {
  //   onDelete: 'NO ACTION',
  // })
  // exam: ExamEntity
}
