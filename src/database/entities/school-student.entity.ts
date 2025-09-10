import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from './base.entity';

@Entity()
export class SchoolStudentEntity extends AppBaseEntity {
 
  @Column()
  schoolId: string;

  @Column()
  studentId: string;

  @Column()
  subjectId: string;

  @Column()
  categoryId: string;

  @Column()
  enrolmentDate: Date;
}
