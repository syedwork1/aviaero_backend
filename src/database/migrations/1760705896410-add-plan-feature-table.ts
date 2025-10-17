import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlanFeatureTable1760705896410 implements MigrationInterface {
    name = 'AddPlanFeatureTable1760705896410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plan_feature_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "planId" uuid, CONSTRAINT "PK_3629fc41fe3246ba55df60d8c29" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" ADD CONSTRAINT "FK_4cec72ae2ce52ebc9957f5844fd" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" DROP CONSTRAINT "FK_4cec72ae2ce52ebc9957f5844fd"`);
        await queryRunner.query(`DROP TABLE "plan_feature_entity"`);
    }

}
