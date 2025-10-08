import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateQuizAnswerRelation1759903015976 implements MigrationInterface {
    name = 'UpdateQuizAnswerRelation1759903015976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_entity" DROP CONSTRAINT "FK_7901f2fc48119c4d97ba7255962"`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" DROP COLUMN "answersId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_entity" ADD "answersId" uuid`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" ADD CONSTRAINT "FK_7901f2fc48119c4d97ba7255962" FOREIGN KEY ("answersId") REFERENCES "quiz_answer_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
