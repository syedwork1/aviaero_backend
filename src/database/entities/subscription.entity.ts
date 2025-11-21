import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { PlanEntity } from "./plan.entity";
import { UserEntity } from "./user.entity";
import { PaymentEntity } from "./payment.entity";
import { PlanDurationEntity } from "./plan-duration.entity";
import { CourceEntity } from "./cource.entity";

@Entity()
export class SubscriptionEntity extends AppBaseEntity {
  @ManyToOne(() => PlanEntity, {
    onDelete: "SET NULL",
  })
  @JoinColumn()
  plan: PlanEntity;

  @ManyToOne(() => PlanDurationEntity, {
    onDelete: "SET NULL",
  })
  @JoinColumn()
  duration: PlanDurationEntity;

  @ManyToOne(() => CourceEntity, {
    onDelete: "SET NULL",
  })
  @JoinColumn()
  subject: CourceEntity;

  @ManyToOne(() => UserEntity, (student) => student.subscription, {
    onDelete: "SET NULL",
  })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => PaymentEntity, {
    onDelete: "SET NULL",
  })
  @JoinColumn()
  payment: PaymentEntity;

  @Column({ nullable: false })
  expireAt: Date;
}
