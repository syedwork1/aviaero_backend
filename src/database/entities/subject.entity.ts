import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from './base.entity';

@Entity()
export class SubjectEntity extends AppBaseEntity {
 
  @Column()
  name: string;

}
