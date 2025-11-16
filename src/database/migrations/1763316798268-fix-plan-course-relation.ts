import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPlanCourseRelation1763316798268 implements MigrationInterface {
    name = 'FixPlanCourseRelation1763316798268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP CONSTRAINT "FK_5dae6b342559953a50cef9fb3d7"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD CONSTRAINT "FK_5dae6b342559953a50cef9fb3d7" FOREIGN KEY ("subjectId") REFERENCES "cource_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP CONSTRAINT "FK_5dae6b342559953a50cef9fb3d7"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD CONSTRAINT "FK_5dae6b342559953a50cef9fb3d7" FOREIGN KEY ("subjectId") REFERENCES "subject_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
