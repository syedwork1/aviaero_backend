import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlanEntity1759317735908 implements MigrationInterface {
    name = 'AddPlanEntity1759317735908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plan_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "exam" integer NOT NULL, "quiz" integer NOT NULL, "student" integer NOT NULL, "courseId" uuid, CONSTRAINT "REL_ad549f837a05ebb7c4e18dea01" UNIQUE ("courseId"), CONSTRAINT "PK_54ee5d16758c16aa9017436cd16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD CONSTRAINT "FK_ad549f837a05ebb7c4e18dea013" FOREIGN KEY ("courseId") REFERENCES "cource_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP CONSTRAINT "FK_ad549f837a05ebb7c4e18dea013"`);
        await queryRunner.query(`DROP TABLE "plan_entity"`);
    }

}
