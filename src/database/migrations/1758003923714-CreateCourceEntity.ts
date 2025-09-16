import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCourceEntity1758003923714 implements MigrationInterface {
    name = 'CreateCourceEntity1758003923714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."exam_entity_status_enum" AS ENUM('PROGRESS', 'COMPLETED', 'DRAFT')`);
        await queryRunner.query(`CREATE TABLE "exam_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "Mobility" character varying NOT NULL, "difficulty" character varying NOT NULL, "CBR_chapter" character varying NOT NULL, "status" "public"."exam_entity_status_enum" NOT NULL, CONSTRAINT "PK_cefdb32da54156587944cea6acd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."cource_entity_status_enum" AS ENUM('ACTIVE', 'IN_ACTIVE')`);
        await queryRunner.query(`CREATE TABLE "cource_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "subjectName" character varying NOT NULL, "status" "public"."cource_entity_status_enum" NOT NULL, "description" character varying NOT NULL, "category" character varying NOT NULL, CONSTRAINT "PK_c011779fee648c148bde854b8e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "examId" uuid`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD CONSTRAINT "FK_15084e53fd5352d4f012d6ec3a4" FOREIGN KEY ("examId") REFERENCES "exam_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP CONSTRAINT "FK_15084e53fd5352d4f012d6ec3a4"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "examId"`);
        await queryRunner.query(`DROP TABLE "cource_entity"`);
        await queryRunner.query(`DROP TYPE "public"."cource_entity_status_enum"`);
        await queryRunner.query(`DROP TABLE "exam_entity"`);
        await queryRunner.query(`DROP TYPE "public"."exam_entity_status_enum"`);
    }

}
