import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePlan1761123186256 implements MigrationInterface {
    name = 'UpdatePlan1761123186256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" ALTER COLUMN "limit" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" ALTER COLUMN "limit" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" ALTER COLUMN "description" SET NOT NULL`);
    }

}
