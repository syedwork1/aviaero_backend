import { Column, Entity, ManyToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
@Entity()
export class PaymentEntity extends AppBaseEntity {
  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  paymentId: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
