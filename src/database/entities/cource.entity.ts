import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { CourceStatus } from "../../modules/cources/enums/status.enum";

@Entity()
export class CourceEntity extends AppBaseEntity {
  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: CourceStatus,
  })
  status: CourceStatus;

  @Column()
  description: string;
}
