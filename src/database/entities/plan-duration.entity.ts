import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { PlanEntity } from "./plan.entity";

@Entity()
export class PlanDurationEntity extends AppBaseEntity {
  @Column({ nullable: true })
  durationInMonths: number;

  @Column("decimal", { precision: 6, scale: 2, default: 0 })
  price: number;

  @ManyToOne(() => PlanEntity)
  @JoinColumn()
  plan: PlanEntity;
}
