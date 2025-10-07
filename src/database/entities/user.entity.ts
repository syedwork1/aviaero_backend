import { Column, Entity, OneToMany } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { IsEmail, IsNotEmpty } from "class-validator";
import { FeedbackEntity } from "./feedback.entity";
import { QuizEntity } from "./quiz.entity";
@Entity()
export class UserEntity extends AppBaseEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ default: "STUDENT" })
  @IsNotEmpty()
  role: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => FeedbackEntity, (feeback) => feeback.student)
  feedback: FeedbackEntity;

  @OneToMany(() => QuizEntity, (quiz) => quiz.student)
  quiz: QuizEntity;

  // @Column()
  // phone: string;

  // @Column({ unique: true })
  // username: string;
}
