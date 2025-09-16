
import { Column, Entity,OneToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import {CategoryStatus} from '../../modules/cources/enums/status.enum'


@Entity()
export class CourceEntity extends AppBaseEntity {
  
  @Column()   
  name:string;

  @Column()
  subjectName: string;


  @Column({
     type: 'enum',
     enum: CategoryStatus,
   })
   status: CategoryStatus;


  @Column()
  description: string;


  @Column()
  categoryId: string;

 
}
