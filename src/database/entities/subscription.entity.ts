import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { StudentEntity } from "./student.entity";
import { PlanEntity } from "./plan.entity";
import { UserEntity } from "./user.entity";
import { PaymentEntity } from "./payment.entity";
@Entity()
export class SubscriptionEntity extends AppBaseEntity {
  @ManyToOne(() => PlanEntity)
  @JoinColumn()
  plan: PlanEntity;

  @ManyToOne(() => UserEntity, (student) => student.subscription)
  @JoinColumn()
  user: UserEntity;

  @OneToOne(() => PaymentEntity, (payment) => payment.subscription)
  @JoinColumn()
  payment: PaymentEntity;

  @Column({ nullable: false })
  expireAt: Date;
}
