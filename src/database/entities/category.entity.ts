import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from './base.entity';

@Entity()
export class CategoryEntity extends AppBaseEntity {
 
  @Column()
  name: string;
}
