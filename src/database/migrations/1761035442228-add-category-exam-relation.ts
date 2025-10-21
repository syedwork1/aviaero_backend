import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryExamRelation1761035442228
  implements MigrationInterface
{
  name = "AddCategoryExamRelation1761035442228";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "exam_entity_cbr_chapters_category_entity" ("examEntityId" uuid NOT NULL, "categoryEntityId" uuid NOT NULL, CONSTRAINT "PK_7c697d0db79914e6adc85739f92" PRIMARY KEY ("examEntityId", "categoryEntityId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_565c72e16fa0cc2cf1a74e0ecd" ON "exam_entity_cbr_chapters_category_entity" ("examEntityId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd709ae6e34a05f861f4d63c4e" ON "exam_entity_cbr_chapters_category_entity" ("categoryEntityId") `
    );
    await queryRunner.query(
      `CREATE TABLE "exam_entity_courses_cource_entity" ("examEntityId" uuid NOT NULL, "courceEntityId" uuid NOT NULL, CONSTRAINT "PK_0367a8b8399f9be171840307538" PRIMARY KEY ("examEntityId", "courceEntityId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_05f37068bc86619ae6f8ee254f" ON "exam_entity_courses_cource_entity" ("examEntityId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f56cb570320c4c4c782d2b34b4" ON "exam_entity_courses_cource_entity" ("courceEntityId") `
    );
    await queryRunner.query(`ALTER TABLE "exam_entity" DROP COLUMN "end_date"`);
    await queryRunner.query(
      `ALTER TABLE "exam_entity" DROP COLUMN "CBR_chapter"`
    );
    await queryRunner.query(
      `ALTER TABLE "exam_entity" DROP COLUMN "studentId"`
    );
    await queryRunner.query(
      `ALTER TABLE "exam_entity_cbr_chapters_category_entity" ADD CONSTRAINT "FK_565c72e16fa0cc2cf1a74e0ecd5" FOREIGN KEY ("examEntityId") REFERENCES "exam_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "exam_entity_cbr_chapters_category_entity" ADD CONSTRAINT "FK_fd709ae6e34a05f861f4d63c4e9" FOREIGN KEY ("categoryEntityId") REFERENCES "category_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "exam_entity_courses_cource_entity" ADD CONSTRAINT "FK_05f37068bc86619ae6f8ee254f7" FOREIGN KEY ("examEntityId") REFERENCES "exam_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "exam_entity_courses_cource_entity" ADD CONSTRAINT "FK_f56cb570320c4c4c782d2b34b4c" FOREIGN KEY ("courceEntityId") REFERENCES "cource_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exam_entity_courses_cource_entity" DROP CONSTRAINT "FK_f56cb570320c4c4c782d2b34b4c"`
    );
    await queryRunner.query(
      `ALTER TABLE "exam_entity_courses_cource_entity" DROP CONSTRAINT "FK_05f37068bc86619ae6f8ee254f7"`
    );
    await queryRunner.query(
      `ALTER TABLE "exam_entity_cbr_chapters_category_entity" DROP CONSTRAINT "FK_fd709ae6e34a05f861f4d63c4e9"`
    );
    await queryRunner.query(
      `ALTER TABLE "exam_entity_cbr_chapters_category_entity" DROP CONSTRAINT "FK_565c72e16fa0cc2cf1a74e0ecd5"`
    );
    await queryRunner.query(
      `ALTER TABLE "exam_entity" ADD "studentId" character varying NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "exam_entity" ADD "CBR_chapter" character varying NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "exam_entity" ADD "end_date" TIMESTAMP NULL`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f56cb570320c4c4c782d2b34b4"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_05f37068bc86619ae6f8ee254f"`
    );
    await queryRunner.query(`DROP TABLE "exam_entity_courses_cource_entity"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd709ae6e34a05f861f4d63c4e"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_565c72e16fa0cc2cf1a74e0ecd"`
    );
    await queryRunner.query(
      `DROP TABLE "exam_entity_cbr_chapters_category_entity"`
    );
  }
}
