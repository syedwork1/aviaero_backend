import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { CourceEntity } from "../entities/cource.entity";

@Entity()
export class CategoryEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  CBR_chapter: string;

  @OneToOne(() => CourceEntity, (cource) => cource.category, {})
  cource: CourceEntity;
}
