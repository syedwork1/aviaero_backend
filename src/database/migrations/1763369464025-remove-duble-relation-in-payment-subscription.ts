import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDubleRelationInPaymentSubscription1763369464025 implements MigrationInterface {
    name = 'RemoveDubleRelationInPaymentSubscription1763369464025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP CONSTRAINT "FK_04ee08eebdbcbb7c4e0c47076fe"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP COLUMN "subscriptionId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD "subscriptionId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD CONSTRAINT "FK_04ee08eebdbcbb7c4e0c47076fe" FOREIGN KEY ("subscriptionId") REFERENCES "subscription_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
