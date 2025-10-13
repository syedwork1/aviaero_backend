import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSchoolStudentRelation1760344725629 implements MigrationInterface {
    name = 'AddSchoolStudentRelation1760344725629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "student_school_entity" ("schoolId" character varying NOT NULL, "studentId" character varying NOT NULL, CONSTRAINT "PK_fdc3619777dbec21abdeb8fbcc0" PRIMARY KEY ("schoolId", "studentId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "student_school_entity"`);
    }

}
