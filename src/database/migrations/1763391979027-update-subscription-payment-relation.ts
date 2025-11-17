import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSubscriptionPaymentRelation1763391979027 implements MigrationInterface {
    name = 'UpdateSubscriptionPaymentRelation1763391979027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_f99c4be631a3c5604c26d81b281"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "UQ_f99c4be631a3c5604c26d81b281"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_f99c4be631a3c5604c26d81b281" FOREIGN KEY ("paymentId") REFERENCES "payment_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_f99c4be631a3c5604c26d81b281"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "UQ_f99c4be631a3c5604c26d81b281" UNIQUE ("paymentId")`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_f99c4be631a3c5604c26d81b281" FOREIGN KEY ("paymentId") REFERENCES "payment_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
