import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { PlanFeatureEntity } from "./plan-feature.entity";
import { PlanTypeEnum } from "@core/enums/plan.enum";
import { PlanDurationEntity } from "./plan-duration.entity";
import { PlanSubjectEntity } from "./plan-subject.entity";
@Entity()
export class PlanEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: "ACTIVE" })
  status: string;

  @Column({ default: PlanTypeEnum.FEATURE })
  type: string;

  @OneToMany(() => PlanFeatureEntity, (feature) => feature.plan)
  features: PlanFeatureEntity[];

  @OneToMany(() => PlanDurationEntity, (plan) => plan.plan)
  durations: PlanDurationEntity[];

  @OneToOne(() => PlanSubjectEntity)
  subject: PlanSubjectEntity;
}
