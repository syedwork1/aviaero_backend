import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { IsEmail, IsNotEmpty } from "class-validator";
import { CourceEntity } from "./cource.entity";
import { PlanFeatureEntity } from "./plan-feature.entity";
@Entity()
export class PlanEntity extends AppBaseEntity {
  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column({ default: "ACTIVE" })
  @IsNotEmpty()
  status: string;

  @Column()
  @IsNotEmpty()
  price: number;

  @OneToMany(() => PlanFeatureEntity, (feature) => feature.plan)
  features: PlanFeatureEntity;

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
