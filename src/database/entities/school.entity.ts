import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from './base.entity';

@Entity()
export class SchoolEntity extends AppBaseEntity {
 
  @Column()
  name: string;

  @Column()
  status: string;

}
