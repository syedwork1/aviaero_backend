import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PlanEntity } from "./plan.entity";

@Entity()
export class PlanFeatureEntity extends AppBaseEntity {
  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsOptional()
  @IsString()
  description: string;

  @ManyToOne(() => PlanEntity)
  @JoinColumn()
  plan: PlanEntity;
}
