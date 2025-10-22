import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePlan1761123060288 implements MigrationInterface {
    name = 'UpdatePlan1761123060288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" DROP COLUMN "limit"`);
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" ADD "limit" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" DROP COLUMN "limit"`);
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" ADD "limit" character varying NOT NULL`);
    }

}
