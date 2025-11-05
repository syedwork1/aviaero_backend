import { Column, Entity, OneToMany } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { FeedbackEntity } from "./feedback.entity";
import { QuizEntity } from "./quiz.entity";
import { SubscriptionEntity } from "./subscription.entity";
import { Role } from "@core/enums/role.enum";
@Entity()
export class UserEntity extends AppBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: Role.STUDENT, nullable: false })
  role: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => FeedbackEntity, (feeback) => feeback.student)
  feedback: FeedbackEntity;

  @OneToMany(() => QuizEntity, (quiz) => quiz.student)
  quiz: QuizEntity;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.user)
  subscription: SubscriptionEntity;
}
