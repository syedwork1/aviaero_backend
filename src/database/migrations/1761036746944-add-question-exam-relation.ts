import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuestionExamRelation1761036746944 implements MigrationInterface {
    name = 'AddQuestionExamRelation1761036746944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exam_entity_questions_questions_entity" ("examEntityId" uuid NOT NULL, "questionsEntityId" uuid NOT NULL, CONSTRAINT "PK_e83bc591e5b954e939a4ab148ca" PRIMARY KEY ("examEntityId", "questionsEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_10bd5800dbcf2eb53ae34a0009" ON "exam_entity_questions_questions_entity" ("examEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2dc5357fca1d071e129bad2ef5" ON "exam_entity_questions_questions_entity" ("questionsEntityId") `);
        await queryRunner.query(`ALTER TABLE "exam_entity_questions_questions_entity" ADD CONSTRAINT "FK_10bd5800dbcf2eb53ae34a0009e" FOREIGN KEY ("examEntityId") REFERENCES "exam_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "exam_entity_questions_questions_entity" ADD CONSTRAINT "FK_2dc5357fca1d071e129bad2ef51" FOREIGN KEY ("questionsEntityId") REFERENCES "questions_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_entity_questions_questions_entity" DROP CONSTRAINT "FK_2dc5357fca1d071e129bad2ef51"`);
        await queryRunner.query(`ALTER TABLE "exam_entity_questions_questions_entity" DROP CONSTRAINT "FK_10bd5800dbcf2eb53ae34a0009e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2dc5357fca1d071e129bad2ef5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_10bd5800dbcf2eb53ae34a0009"`);
        await queryRunner.query(`DROP TABLE "exam_entity_questions_questions_entity"`);
    }

}
