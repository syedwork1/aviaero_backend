import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { SubscriptionEntity } from "./subscription.entity";
import { PlanEntity } from "./plan.entity";
@Entity()
export class PaymentEntity extends AppBaseEntity {
  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  paymentId: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => SubscriptionEntity)
  subscription: SubscriptionEntity;

  @ManyToOne(() => PlanEntity)
  plan: PlanEntity;
}
