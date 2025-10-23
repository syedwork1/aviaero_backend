import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlanIntoPayment1761234298743 implements MigrationInterface {
    name = 'AddPlanIntoPayment1761234298743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD "subscriptionId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD "planId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD CONSTRAINT "FK_04ee08eebdbcbb7c4e0c47076fe" FOREIGN KEY ("subscriptionId") REFERENCES "subscription_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD CONSTRAINT "FK_533a421b472b813033ec604eb98" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP CONSTRAINT "FK_533a421b472b813033ec604eb98"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP CONSTRAINT "FK_04ee08eebdbcbb7c4e0c47076fe"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP COLUMN "planId"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP COLUMN "subscriptionId"`);
    }

}
