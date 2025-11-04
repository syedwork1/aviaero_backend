import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReasonInReport1762256792512 implements MigrationInterface {
    name = 'AddReasonInReport1762256792512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_report_entity" ADD "reason" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_report_entity" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_report_entity" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_report_entity" DROP COLUMN "reason"`);
    }

}
