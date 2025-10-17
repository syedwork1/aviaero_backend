import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchoolRelationInStudentTable1760702855020 implements MigrationInterface {
    name = 'UpdateSchoolRelationInStudentTable1760702855020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_entity" DROP CONSTRAINT "FK_f77ad0fd64b05fbc93a23a92ce3"`);
        await queryRunner.query(`ALTER TABLE "student_entity" DROP CONSTRAINT "UQ_f77ad0fd64b05fbc93a23a92ce3"`);
        await queryRunner.query(`ALTER TABLE "student_entity" ADD CONSTRAINT "FK_f77ad0fd64b05fbc93a23a92ce3" FOREIGN KEY ("schoolId") REFERENCES "school_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_entity" DROP CONSTRAINT "FK_f77ad0fd64b05fbc93a23a92ce3"`);
        await queryRunner.query(`ALTER TABLE "student_entity" ADD CONSTRAINT "UQ_f77ad0fd64b05fbc93a23a92ce3" UNIQUE ("schoolId")`);
        await queryRunner.query(`ALTER TABLE "student_entity" ADD CONSTRAINT "FK_f77ad0fd64b05fbc93a23a92ce3" FOREIGN KEY ("schoolId") REFERENCES "school_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
