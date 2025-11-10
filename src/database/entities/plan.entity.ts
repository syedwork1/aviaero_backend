import { Column, Entity, OneToMany } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { PlanFeatureEntity } from "./plan-feature.entity";
import { PlanStatusEnum } from "@core/enums/plan.enum";
@Entity()
export class PlanEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: "ACTIVE" })
  status: string;

  @Column({ default: PlanStatusEnum.FEATURE })
  type: string;

  @Column()
  price: number;

  @OneToMany(() => PlanFeatureEntity, (feature) => feature.plan)
  features: PlanFeatureEntity[];
}
