import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyColumnQuestionEntity1757676077394 implements MigrationInterface {
    name = 'ModifyColumnQuestionEntity1757676077394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "subscription_level"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "subscription_level" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "subscription_level"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "subscription_level" character varying NOT NULL DEFAULT true`);
    }

}
