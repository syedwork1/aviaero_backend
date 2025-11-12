import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePlanTables1762954892649 implements MigrationInterface {
    name = 'UpdatePlanTables1762954892649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" ADD "limited" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD "duration" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" DROP COLUMN "limited"`);
    }

}
