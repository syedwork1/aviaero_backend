import { Column, Entity,OneToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';


@Entity()
export class ExamQuestionEntity extends AppBaseEntity {
  
  @Column()   
  examId:string;

  @Column()
  questionId: string;



   // One exam has many questions
  // @OneToMany(() => QuestionsEntity, (question) => question.exam, {
  // })
  // questions: QuestionsEntity[];
}
