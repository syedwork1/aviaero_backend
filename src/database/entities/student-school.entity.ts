import { Column, Entity, JoinColumn, PrimaryColumn } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { SchoolEntity } from "./school.entity";

@Entity()
export class StudentSchoolEntity {
  @PrimaryColumn()
  schoolId: string;

  @PrimaryColumn()
  studentId: string;
}
