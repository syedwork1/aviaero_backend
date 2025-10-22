import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { PlanEntity } from "./plan.entity";

@Entity()
export class PlanFeatureEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  limit: number;

  @ManyToOne(() => PlanEntity)
  @JoinColumn()
  plan: PlanEntity;
}
