import { Column, Entity } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Exclude } from "class-transformer";
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

  // @Column()
  // phone: string;

  // @Column({ unique: true })
  // username: string;
}
