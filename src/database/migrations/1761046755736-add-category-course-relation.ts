import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryCourseRelation1761046755736 implements MigrationInterface {
    name = 'AddCategoryCourseRelation1761046755736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_entity" DROP CONSTRAINT "FK_fc02b4b0d7ddfd786b741d6d2e1"`);
        await queryRunner.query(`CREATE TABLE "cource_entity_category_category_entity" ("courceEntityId" uuid NOT NULL, "categoryEntityId" uuid NOT NULL, CONSTRAINT "PK_45505dbb05f455c660f61b77dbe" PRIMARY KEY ("courceEntityId", "categoryEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a7f103b6a5cc702fa594508197" ON "cource_entity_category_category_entity" ("courceEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_208f8b4ae4cc39f09529c76d06" ON "cource_entity_category_category_entity" ("categoryEntityId") `);
        await queryRunner.query(`ALTER TABLE "category_entity" DROP COLUMN "courceId"`);
        await queryRunner.query(`ALTER TABLE "cource_entity_category_category_entity" ADD CONSTRAINT "FK_a7f103b6a5cc702fa5945081977" FOREIGN KEY ("courceEntityId") REFERENCES "cource_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cource_entity_category_category_entity" ADD CONSTRAINT "FK_208f8b4ae4cc39f09529c76d067" FOREIGN KEY ("categoryEntityId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cource_entity_category_category_entity" DROP CONSTRAINT "FK_208f8b4ae4cc39f09529c76d067"`);
        await queryRunner.query(`ALTER TABLE "cource_entity_category_category_entity" DROP CONSTRAINT "FK_a7f103b6a5cc702fa5945081977"`);
        await queryRunner.query(`ALTER TABLE "category_entity" ADD "courceId" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_208f8b4ae4cc39f09529c76d06"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a7f103b6a5cc702fa594508197"`);
        await queryRunner.query(`DROP TABLE "cource_entity_category_category_entity"`);
        await queryRunner.query(`ALTER TABLE "category_entity" ADD CONSTRAINT "FK_fc02b4b0d7ddfd786b741d6d2e1" FOREIGN KEY ("courceId") REFERENCES "cource_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
