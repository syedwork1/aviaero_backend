import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { StudentEntity } from "./student.entity";
import { PlanEntity } from "./plan.entity";
import { UserEntity } from "./user.entity";
@Entity()
export class SubscriptionEntity extends AppBaseEntity {
  @ManyToOne(() => PlanEntity)
  @JoinColumn()
  plan: PlanEntity;

  @ManyToOne(() => UserEntity, (student) => student.subscription)
  @JoinColumn()
  user: UserEntity;

  @Column({ nullable: false })
  expireAt: Date;
}
