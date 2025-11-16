import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { PlanFeatureEntity } from "./plan-feature.entity";
import { PlanTypeEnum } from "@core/enums/plan.enum";
import { PlanDurationEntity } from "./plan-duration.entity";
import { CourceEntity } from "./cource.entity";

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

  @ManyToOne(() => CourceEntity)
  @JoinColumn()
  subject: CourceEntity;
}
