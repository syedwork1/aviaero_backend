
import { Column, Entity,ManyToOne,JoinColumn } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import {CourceStatus} from '../../modules/cources/enums/status.enum'
import {CategoryEntity} from '../entities/category.entity'


@Entity()
export class CourceEntity extends AppBaseEntity {
  
  @Column()   
  name:string;

  @Column()
  subjectName: string;


  @Column({
     type: 'enum',
     enum: CourceStatus,
   })
   status: CourceStatus;


  @Column()
  description: string;


   @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'categoryId' })   
  category: CategoryEntity;

  @Column({ type: 'uuid' })
  categoryId: string;
}

 

