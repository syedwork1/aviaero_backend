import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlanUsage1763638290326 implements MigrationInterface {
    name = 'AddPlanUsage1763638290326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plan_usage_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "feature" character varying NOT NULL, "usage" integer NOT NULL DEFAULT '0', "resetAt" TIMESTAMP, CONSTRAINT "PK_5dc2243a2f64dc21dd8ffd67536" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "plan_usage_entity"`);
    }

}
