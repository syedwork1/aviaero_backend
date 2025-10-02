import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { IsEmail, IsNotEmpty } from "class-validator";
import { CourceEntity } from "./cource.entity";
@Entity()
export class PlanEntity extends AppBaseEntity {
  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column()
  @IsNotEmpty()
  price: number;

  @Column()
  @IsNotEmpty()
  exam: number;

  @Column()
  @IsNotEmpty()
  quiz: number;

  @Column()
  @IsNotEmpty()
  student: number;

  @ManyToOne(() => CourceEntity, (cource) => cource.plan, {})
  @JoinColumn()
  course: CourceEntity;
}
