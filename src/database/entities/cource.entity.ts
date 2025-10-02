import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { CourceStatus } from "../../modules/cources/enums/status.enum";
import { CategoryEntity } from "./category.entity";
import { PlanEntity } from "./plan.entity";

@Entity()
export class CourceEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: CourceStatus,
  })
  status: CourceStatus;

  @Column()
  description: string;

  @ManyToOne(() => CategoryEntity, (category) => category.cource, {})
  @JoinColumn()
  category: CategoryEntity;

  @OneToMany(() => PlanEntity, (plan) => plan.course, {})
  plan: PlanEntity;
}
