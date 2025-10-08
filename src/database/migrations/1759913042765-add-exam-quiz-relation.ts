import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExamQuizRelation1759913042765 implements MigrationInterface {
    name = 'AddExamQuizRelation1759913042765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_entity" ADD "examId" uuid`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" ADD CONSTRAINT "FK_13a06b636f9edf2fae83122d902" FOREIGN KEY ("examId") REFERENCES "exam_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_entity" DROP CONSTRAINT "FK_13a06b636f9edf2fae83122d902"`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" DROP COLUMN "examId"`);
    }

}
