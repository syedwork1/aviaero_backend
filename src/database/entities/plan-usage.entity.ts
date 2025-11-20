import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class PlanUsageEntity extends AppBaseEntity {
  @Column()
  feature: string;

  @JoinColumn()
  @ManyToOne(() => UserEntity)
  student: UserEntity;

  @Column({ default: 0 })
  usage: number;

  @Column({ nullable: true })
  resetAt: Date;
}
