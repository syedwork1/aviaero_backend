import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscriptionTable1761209281528 implements MigrationInterface {
    name = 'AddSubscriptionTable1761209281528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscription_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "expireAt" TIMESTAMP NOT NULL, "planId" uuid, "studentId" uuid, CONSTRAINT "PK_a98819993766819c043b332748d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_34c5811cf2ed14db186f24b3d9b" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_fe0bf579f0e9ef0c20d4a8f7fc3" FOREIGN KEY ("studentId") REFERENCES "student_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_fe0bf579f0e9ef0c20d4a8f7fc3"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_34c5811cf2ed14db186f24b3d9b"`);
        await queryRunner.query(`DROP TABLE "subscription_entity"`);
    }

}
