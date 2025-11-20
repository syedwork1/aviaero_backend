import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePlanUsage1763639877552 implements MigrationInterface {
    name = 'UpdatePlanUsage1763639877552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_usage_entity" ADD "studentId" uuid`);
        await queryRunner.query(`ALTER TABLE "plan_usage_entity" ADD CONSTRAINT "FK_1e1a494086dcd45087d3961b20c" FOREIGN KEY ("studentId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_usage_entity" DROP CONSTRAINT "FK_1e1a494086dcd45087d3961b20c"`);
        await queryRunner.query(`ALTER TABLE "plan_usage_entity" DROP COLUMN "studentId"`);
    }

}
