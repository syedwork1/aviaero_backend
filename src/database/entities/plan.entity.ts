import { Column, Entity, OneToMany } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { PlanFeatureEntity } from "./plan-feature.entity";
@Entity()
export class PlanEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: "ACTIVE" })
  status: string;

  @Column()
  price: number;

  @OneToMany(() => PlanFeatureEntity, (feature) => feature.plan)
  features: PlanFeatureEntity[];
}
