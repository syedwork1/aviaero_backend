import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateQuestionQuizRelation1759903521129 implements MigrationInterface {
    name = 'UpdateQuestionQuizRelation1759903521129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP CONSTRAINT "FK_1df7cc58726f88ce2308aa3c1e2"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "quizAnswerId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "quizAnswerId" uuid`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD CONSTRAINT "FK_1df7cc58726f88ce2308aa3c1e2" FOREIGN KEY ("quizAnswerId") REFERENCES "quiz_answer_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
