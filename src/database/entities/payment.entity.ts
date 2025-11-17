import { Column, Entity, ManyToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { SubscriptionEntity } from "./subscription.entity";
import { PlanEntity } from "./plan.entity";
import { PlanDurationEntity } from "./plan-duration.entity";
@Entity()
export class PaymentEntity extends AppBaseEntity {
  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  paymentId: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => PlanEntity)
  plan: PlanEntity;

  @ManyToOne(() => PlanDurationEntity)
  duration: PlanDurationEntity;
}
