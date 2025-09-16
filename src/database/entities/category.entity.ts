import { Column, Entity,ManyToOne,OneToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import {CourceEntity} from '../entities/cource.entity'

@Entity()
export class CategoryEntity extends AppBaseEntity {
 
  @Column()
  name: string;

    @OneToMany(() => CourceEntity, (course) => course.category)
  courses: CourceEntity[];
}
