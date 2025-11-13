import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubjectDurationTables1763043929931 implements MigrationInterface {
    name = 'AddSubjectDurationTables1763043929931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plan_duration_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "durationInMonths" integer, "price" numeric(6,2) NOT NULL DEFAULT '0', "planId" uuid, CONSTRAINT "PK_ba4a6b79846a3a302a63ee35f44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan_subject_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "subjectId" uuid, "planId" uuid, CONSTRAINT "PK_fa2f1ec8ad581d934794a051cd1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD "durationId" uuid`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD "durationId" uuid`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD "subjectId" uuid`);
        await queryRunner.query(`ALTER TABLE "plan_duration_entity" ADD CONSTRAINT "FK_fc26246d3df09ce357ecd34d9a4" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_subject_entity" ADD CONSTRAINT "FK_68af2c70bbb0747f5ce70e5aee7" FOREIGN KEY ("subjectId") REFERENCES "subject_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_subject_entity" ADD CONSTRAINT "FK_4ce4f7f4afe648927bea64db4c7" FOREIGN KEY ("planId") REFERENCES "plan_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD CONSTRAINT "FK_5044293c8a6e0bf3d701186b655" FOREIGN KEY ("durationId") REFERENCES "plan_duration_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_0e608c958bc597e018845e29c85" FOREIGN KEY ("durationId") REFERENCES "plan_duration_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_4a0ae68c88b001ac251064bb9d5" FOREIGN KEY ("subjectId") REFERENCES "subject_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_4a0ae68c88b001ac251064bb9d5"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_0e608c958bc597e018845e29c85"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP CONSTRAINT "FK_5044293c8a6e0bf3d701186b655"`);
        await queryRunner.query(`ALTER TABLE "plan_subject_entity" DROP CONSTRAINT "FK_4ce4f7f4afe648927bea64db4c7"`);
        await queryRunner.query(`ALTER TABLE "plan_subject_entity" DROP CONSTRAINT "FK_68af2c70bbb0747f5ce70e5aee7"`);
        await queryRunner.query(`ALTER TABLE "plan_duration_entity" DROP CONSTRAINT "FK_fc26246d3df09ce357ecd34d9a4"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP COLUMN "subjectId"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP COLUMN "durationId"`);
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP COLUMN "durationId"`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD "duration" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "plan_entity" ADD "price" numeric(6,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "plan_subject_entity"`);
        await queryRunner.query(`DROP TABLE "plan_duration_entity"`);
    }

}
