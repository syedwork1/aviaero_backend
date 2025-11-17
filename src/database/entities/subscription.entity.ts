import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { StudentEntity } from "./student.entity";
import { PlanEntity } from "./plan.entity";
import { UserEntity } from "./user.entity";
import { PaymentEntity } from "./payment.entity";
import { PlanDurationEntity } from "./plan-duration.entity";
import { CourceEntity } from "./cource.entity";

@Entity()
export class SubscriptionEntity extends AppBaseEntity {
  @ManyToOne(() => PlanEntity)
  @JoinColumn()
  plan: PlanEntity;

  @ManyToOne(() => PlanDurationEntity)
  @JoinColumn()
  duration: PlanDurationEntity;

  @ManyToOne(() => CourceEntity)
  @JoinColumn()
  subject: CourceEntity;

  @ManyToOne(() => UserEntity, (student) => student.subscription)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => PaymentEntity)
  @JoinColumn()
  payment: PaymentEntity;

  @Column({ nullable: false })
  expireAt: Date;
}
