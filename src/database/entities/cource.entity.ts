import { Column, Entity, ManyToMany, JoinTable } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { CourceStatus } from "../../modules/cources/enums/status.enum";
import { CategoryEntity } from "./category.entity";

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

  @ManyToMany(() => CategoryEntity, (category) => category.cource, {})
  @JoinTable()
  category: CategoryEntity[];
}
