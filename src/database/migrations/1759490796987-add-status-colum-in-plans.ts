import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusColumInPlans1759490796987 implements MigrationInterface {
    name = 'AddStatusColumInPlans1759490796987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP COLUMN "status"`);
    }

}
