import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeInPlan1762773953023 implements MigrationInterface {
    name = 'AddTypeInPlan1762773953023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD "type" character varying NOT NULL DEFAULT 'FEATURE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP COLUMN "type"`);
    }

}
