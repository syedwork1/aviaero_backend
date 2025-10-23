import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { IsEmail, IsNotEmpty } from "class-validator";
import { FeedbackEntity } from "./feedback.entity";
import { QuizEntity } from "./quiz.entity";
import { UserEntity } from "./user.entity";
import { SchoolEntity } from "./school.entity";
import { SubscriptionEntity } from "./subscription.entity";
@Entity()
export class StudentEntity extends AppBaseEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => FeedbackEntity, (feeback) => feeback.student)
  feedback: FeedbackEntity;

  @OneToMany(() => QuizEntity, (quiz) => quiz.student)
  quiz: QuizEntity;

  @JoinColumn()
  @OneToOne(() => UserEntity)
  user: UserEntity;

  @JoinColumn()
  @ManyToOne(() => SchoolEntity)
  school: SchoolEntity;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.student)
  subscription: SubscriptionEntity;
}
