import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { IsEmail, IsNotEmpty } from 'class-validator';
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

  @Column()
  subscription_level: string;

  @Column()
  is_exam_question: boolean;

  @Column()
  difficulty: string;

  @Column()
  CBR_chapter: string;

}
