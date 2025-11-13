import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { PlanEntity } from "./plan.entity";
import { SubjectEntity } from "./subject.entity";

@Entity()
export class PlanSubjectEntity extends AppBaseEntity {
  @ManyToOne(() => SubjectEntity)
  @JoinColumn()
  subject: SubjectEntity;

  @ManyToOne(() => PlanEntity)
  @JoinColumn()
  plan: PlanEntity;
}
