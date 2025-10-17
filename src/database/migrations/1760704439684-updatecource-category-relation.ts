import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatecourceCategoryRelation1760704439684 implements MigrationInterface {
    name = 'UpdatecourceCategoryRelation1760704439684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cource_entity" DROP CONSTRAINT "FK_08501f2d096645e5e755b46a724"`);
        await queryRunner.query(`ALTER TABLE "cource_entity" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "category_entity" ADD "courceId" uuid`);
        await queryRunner.query(`ALTER TABLE "category_entity" ADD CONSTRAINT "FK_fc02b4b0d7ddfd786b741d6d2e1" FOREIGN KEY ("courceId") REFERENCES "cource_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_entity" DROP CONSTRAINT "FK_fc02b4b0d7ddfd786b741d6d2e1"`);
        await queryRunner.query(`ALTER TABLE "category_entity" DROP COLUMN "courceId"`);
        await queryRunner.query(`ALTER TABLE "cource_entity" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "cource_entity" ADD CONSTRAINT "FK_08501f2d096645e5e755b46a724" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
