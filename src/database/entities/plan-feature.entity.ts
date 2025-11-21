import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { PlanEntity } from "./plan.entity";

@Entity()
export class PlanFeatureEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  limited: boolean;

  @Column({ nullable: true })
  limit: number;

  @ManyToOne(() => PlanEntity, {
    onDelete: "SET NULL",
  })
  @JoinColumn()
  plan: PlanEntity;
}
