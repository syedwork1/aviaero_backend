import { Column, Entity, ManyToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { PlanEntity } from "./plan.entity";
import { PlanDurationEntity } from "./plan-duration.entity";
@Entity()
export class PaymentEntity extends AppBaseEntity {
  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  paymentId: string;

  @ManyToOne(() => UserEntity, {
    onDelete: "SET NULL",
  })
  user: UserEntity;

  @ManyToOne(() => PlanEntity, {
    onDelete: "SET NULL",
  })
  plan: PlanEntity;

  @ManyToOne(() => PlanDurationEntity, {
    onDelete: "SET NULL",
  })
  duration: PlanDurationEntity;
}
