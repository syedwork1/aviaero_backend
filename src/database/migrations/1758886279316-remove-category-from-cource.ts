import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCategoryFromCource1758886279316 implements MigrationInterface {
    name = 'RemoveCategoryFromCource1758886279316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cource_entity" DROP CONSTRAINT "FK_08501f2d096645e5e755b46a724"`);
        await queryRunner.query(`ALTER TABLE "cource_entity" DROP COLUMN "categoryId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cource_entity" ADD "categoryId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cource_entity" ADD CONSTRAINT "FK_08501f2d096645e5e755b46a724" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
