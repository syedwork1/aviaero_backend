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

  @Column({ default: true })
  subscription_level: boolean;

  @Column({ default: true })
  is_exam_question: boolean;
  
  @Column({ nullable: true })
  Mobility: string;

  @Column()
  difficulty: string;

  @Column()
  CBR_chapter: string;

}
