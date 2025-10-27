import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateQuestionSubscription1761567062435 implements MigrationInterface {
    name = 'UpdateQuestionSubscription1761567062435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "subscription_level"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "subscription_level" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "subscription_level"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "subscription_level" boolean NOT NULL DEFAULT true`);
    }

}
