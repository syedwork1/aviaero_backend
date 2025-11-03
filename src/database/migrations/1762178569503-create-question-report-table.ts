import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuestionReportTable1762178569503 implements MigrationInterface {
    name = 'CreateQuestionReportTable1762178569503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "question_report_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL, "userId" uuid, "questionId" uuid, CONSTRAINT "PK_404ad96bb0bef1fef0809c00b44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "question_report_entity" ADD CONSTRAINT "FK_2f3004ea7c64fb171fbdc252609" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_report_entity" ADD CONSTRAINT "FK_7a97c466969bcc2acf4e1dcef6b" FOREIGN KEY ("questionId") REFERENCES "questions_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_report_entity" DROP CONSTRAINT "FK_7a97c466969bcc2acf4e1dcef6b"`);
        await queryRunner.query(`ALTER TABLE "question_report_entity" DROP CONSTRAINT "FK_2f3004ea7c64fb171fbdc252609"`);
        await queryRunner.query(`DROP TABLE "question_report_entity"`);
    }

}
