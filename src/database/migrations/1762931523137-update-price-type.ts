import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePriceType1762931523137 implements MigrationInterface {
    name = 'UpdatePriceType1762931523137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD "price" numeric(6,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD "price" integer NOT NULL`);
    }

}
