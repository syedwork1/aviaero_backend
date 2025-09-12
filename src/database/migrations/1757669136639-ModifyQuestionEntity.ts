import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyQuestionEntity1757669136639 implements MigrationInterface {
    name = 'ModifyQuestionEntity1757669136639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "Mobility" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ALTER COLUMN "subscription_level" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ALTER COLUMN "is_exam_question" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" ALTER COLUMN "is_exam_question" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ALTER COLUMN "subscription_level" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "Mobility"`);
    }

}
