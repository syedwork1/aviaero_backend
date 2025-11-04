import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { QuestionsEntity } from "./question.entity";
@Entity()
export class QuestionReportEntity extends AppBaseEntity {
  @Column({ nullable: false })
  reason: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => QuestionsEntity)
  question: QuestionsEntity;
}
