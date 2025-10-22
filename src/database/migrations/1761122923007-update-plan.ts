import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePlan1761122923007 implements MigrationInterface {
    name = 'UpdatePlan1761122923007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP CONSTRAINT "FK_ad549f837a05ebb7c4e18dea013"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP COLUMN "exam"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP COLUMN "quiz"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP COLUMN "student"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP COLUMN "courseId"`);
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" ADD "limit" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" DROP COLUMN "limit"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD "courseId" uuid`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD "student" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD "quiz" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD "exam" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD CONSTRAINT "FK_ad549f837a05ebb7c4e18dea013" FOREIGN KEY ("courseId") REFERENCES "cource_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
