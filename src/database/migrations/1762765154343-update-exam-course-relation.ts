import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExamCourseRelation1762765154343 implements MigrationInterface {
    name = 'UpdateExamCourseRelation1762765154343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_entity" ADD "courseId" uuid`);
        await queryRunner.query(`ALTER TABLE "exam_entity" ADD CONSTRAINT "FK_960899ca548e12b16b03aac2eeb" FOREIGN KEY ("courseId") REFERENCES "cource_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_entity" DROP CONSTRAINT "FK_960899ca548e12b16b03aac2eeb"`);
        await queryRunner.query(`ALTER TABLE "exam_entity" DROP COLUMN "courseId"`);
    }

}
