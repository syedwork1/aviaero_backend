

import { Column, Entity,OneToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import {ExamStatus} from '../../modules/exam/enums/role.enum'
import { QuestionsEntity } from './question.entity';

@Entity()
export class ExamEntity extends AppBaseEntity {
  
  @Column()   
  name:string;

  @Column()
  Mobility: string;

  @Column()
  difficulty: string;

  @Column()
  CBR_chapter: string;

  @Column({
    type: 'enum',
    enum: ExamStatus,
  
  })
  status: ExamStatus;

   // One exam has many questions
  @OneToMany(() => QuestionsEntity, (question) => question.exam, {
  })
  questions: QuestionsEntity[];
}
