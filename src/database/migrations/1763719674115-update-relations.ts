import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelations1763719674115 implements MigrationInterface {
    name = 'UpdateRelations1763719674115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" DROP CONSTRAINT "FK_4cec72ae2ce52ebc9957f5844fd"`);
        await queryRunner.query(`ALTER TABLE "plan_duration_entity" DROP CONSTRAINT "FK_fc26246d3df09ce357ecd34d9a4"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP CONSTRAINT "FK_5dae6b342559953a50cef9fb3d7"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP CONSTRAINT "FK_5044293c8a6e0bf3d701186b655"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP CONSTRAINT "FK_533a421b472b813033ec604eb98"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP CONSTRAINT "FK_5fd2756650ddadbc8c96be6106a"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_f99c4be631a3c5604c26d81b281"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_4a0ae68c88b001ac251064bb9d5"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_0e608c958bc597e018845e29c85"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_1de6c48093b2c28a389d94ee2f8"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_34c5811cf2ed14db186f24b3d9b"`);
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" ADD CONSTRAINT "FK_4cec72ae2ce52ebc9957f5844fd" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_duration_entity" ADD CONSTRAINT "FK_fc26246d3df09ce357ecd34d9a4" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD CONSTRAINT "FK_5dae6b342559953a50cef9fb3d7" FOREIGN KEY ("subjectId") REFERENCES "cource_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD CONSTRAINT "FK_5fd2756650ddadbc8c96be6106a" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD CONSTRAINT "FK_533a421b472b813033ec604eb98" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD CONSTRAINT "FK_5044293c8a6e0bf3d701186b655" FOREIGN KEY ("durationId") REFERENCES "plan_duration_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_34c5811cf2ed14db186f24b3d9b" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_0e608c958bc597e018845e29c85" FOREIGN KEY ("durationId") REFERENCES "plan_duration_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_4a0ae68c88b001ac251064bb9d5" FOREIGN KEY ("subjectId") REFERENCES "cource_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_1de6c48093b2c28a389d94ee2f8" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_f99c4be631a3c5604c26d81b281" FOREIGN KEY ("paymentId") REFERENCES "payment_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_f99c4be631a3c5604c26d81b281"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_1de6c48093b2c28a389d94ee2f8"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_4a0ae68c88b001ac251064bb9d5"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_0e608c958bc597e018845e29c85"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_34c5811cf2ed14db186f24b3d9b"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP CONSTRAINT "FK_5044293c8a6e0bf3d701186b655"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP CONSTRAINT "FK_533a421b472b813033ec604eb98"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP CONSTRAINT "FK_5fd2756650ddadbc8c96be6106a"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP CONSTRAINT "FK_5dae6b342559953a50cef9fb3d7"`);
        await queryRunner.query(`ALTER TABLE "plan_duration_entity" DROP CONSTRAINT "FK_fc26246d3df09ce357ecd34d9a4"`);
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" DROP CONSTRAINT "FK_4cec72ae2ce52ebc9957f5844fd"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_34c5811cf2ed14db186f24b3d9b" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_1de6c48093b2c28a389d94ee2f8" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_0e608c958bc597e018845e29c85" FOREIGN KEY ("durationId") REFERENCES "plan_duration_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_4a0ae68c88b001ac251064bb9d5" FOREIGN KEY ("subjectId") REFERENCES "cource_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_f99c4be631a3c5604c26d81b281" FOREIGN KEY ("paymentId") REFERENCES "payment_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD CONSTRAINT "FK_5fd2756650ddadbc8c96be6106a" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD CONSTRAINT "FK_533a421b472b813033ec604eb98" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD CONSTRAINT "FK_5044293c8a6e0bf3d701186b655" FOREIGN KEY ("durationId") REFERENCES "plan_duration_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD CONSTRAINT "FK_5dae6b342559953a50cef9fb3d7" FOREIGN KEY ("subjectId") REFERENCES "cource_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_duration_entity" ADD CONSTRAINT "FK_fc26246d3df09ce357ecd34d9a4" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_feature_entity" ADD CONSTRAINT "FK_4cec72ae2ce52ebc9957f5844fd" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
