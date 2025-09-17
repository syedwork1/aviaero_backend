import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExamQuestionEntity1758105584421 implements MigrationInterface {
    name = 'CreateExamQuestionEntity1758105584421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP CONSTRAINT "FK_15084e53fd5352d4f012d6ec3a4"`);
        await queryRunner.query(`CREATE TABLE "exam_question_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "examId" character varying NOT NULL, "questionId" character varying NOT NULL, CONSTRAINT "PK_e03d7ad4b8caf032388db363027" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "examId"`);
        await queryRunner.query(`ALTER TABLE "exam_entity" DROP COLUMN "Mobility"`);
        await queryRunner.query(`ALTER TABLE "exam_entity" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."exam_entity_status_enum"`);
        await queryRunner.query(`ALTER TABLE "exam_entity" ADD "number_of_questions" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam_entity" ADD "studentId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_entity" DROP COLUMN "studentId"`);
        await queryRunner.query(`ALTER TABLE "exam_entity" DROP COLUMN "number_of_questions"`);
        await queryRunner.query(`CREATE TYPE "public"."exam_entity_status_enum" AS ENUM('PROGRESS', 'COMPLETED', 'DRAFT')`);
        await queryRunner.query(`ALTER TABLE "exam_entity" ADD "status" "public"."exam_entity_status_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam_entity" ADD "Mobility" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "examId" uuid`);
        await queryRunner.query(`DROP TABLE "exam_question_entity"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD CONSTRAINT "FK_15084e53fd5352d4f012d6ec3a4" FOREIGN KEY ("examId") REFERENCES "exam_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
