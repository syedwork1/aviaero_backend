import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCourceCategoryRelation1759149984090
  implements MigrationInterface
{
  name = "AddCourceCategoryRelation1759149984090";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cource_entity" ADD "categoryId" uuid`
    );
    await queryRunner.query(
      `ALTER TABLE "cource_entity" ADD CONSTRAINT "UQ_08501f2d096645e5e755b46a724" UNIQUE ("categoryId")`
    );
    await queryRunner.query(
      `ALTER TABLE "cource_entity" ADD CONSTRAINT "FK_08501f2d096645e5e755b46a724" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cource_entity" DROP CONSTRAINT "FK_08501f2d096645e5e755b46a724"`
    );
    await queryRunner.query(
      `ALTER TABLE "cource_entity" DROP CONSTRAINT "UQ_08501f2d096645e5e755b46a724"`
    );
    await queryRunner.query(
      `ALTER TABLE "cource_entity" DROP COLUMN "categoryId"`
    );
  }
}
