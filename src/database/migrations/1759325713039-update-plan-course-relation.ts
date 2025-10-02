import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePlanCourseRelation1759325713039 implements MigrationInterface {
    name = 'UpdatePlanCourseRelation1759325713039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP CONSTRAINT "FK_ad549f837a05ebb7c4e18dea013"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP CONSTRAINT "REL_ad549f837a05ebb7c4e18dea01"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD CONSTRAINT "FK_ad549f837a05ebb7c4e18dea013" FOREIGN KEY ("courseId") REFERENCES "cource_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP CONSTRAINT "FK_ad549f837a05ebb7c4e18dea013"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD CONSTRAINT "REL_ad549f837a05ebb7c4e18dea01" UNIQUE ("courseId")`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD CONSTRAINT "FK_ad549f837a05ebb7c4e18dea013" FOREIGN KEY ("courseId") REFERENCES "cource_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
