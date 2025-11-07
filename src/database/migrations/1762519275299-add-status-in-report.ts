import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusInReport1762519275299 implements MigrationInterface {
    name = 'AddStatusInReport1762519275299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_report_entity" ADD "status" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_report_entity" DROP COLUMN "status"`);
    }

}
