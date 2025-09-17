

import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from './base.entity';

@Entity()
export class ExamEntity extends AppBaseEntity {
  
  @Column()   
  name:string;

  @Column()
  number_of_questions: number;

  @Column()
  difficulty: string;

  @Column()
  CBR_chapter: string;
  
  
   @Column()
  studentId: string;


   @Column()
  end_date: Date;
  
 @Column()
  time: number;
  

 
}
