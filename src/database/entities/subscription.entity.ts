import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { StudentEntity } from "./student.entity";
import { PlanEntity } from "./plan.entity";
@Entity()
export class SubscriptionEntity extends AppBaseEntity {
  @ManyToOne(() => PlanEntity)
  @JoinColumn()
  plan: PlanEntity;

  @ManyToOne(() => StudentEntity, (student) => student.subscription)
  @JoinColumn()
  student: StudentEntity;

  @Column({ nullable: false })
  expireAt: Date;
}
