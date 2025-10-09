import { Column, Entity, OneToMany } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { FeedbackEntity } from "./feedback.entity";

@Entity()
export class SubjectEntity extends AppBaseEntity {
  @Column()
  name: string;
}
