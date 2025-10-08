import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoryQuizRelation1759904257636 implements MigrationInterface {
    name = 'UpdateCategoryQuizRelation1759904257636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_entity" DROP CONSTRAINT "FK_0835e37deb3fe143f12759bde5b"`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" DROP CONSTRAINT "REL_0835e37deb3fe143f12759bde5"`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" ADD CONSTRAINT "FK_0835e37deb3fe143f12759bde5b" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_entity" DROP CONSTRAINT "FK_0835e37deb3fe143f12759bde5b"`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" ADD CONSTRAINT "REL_0835e37deb3fe143f12759bde5" UNIQUE ("categoryId")`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" ADD CONSTRAINT "FK_0835e37deb3fe143f12759bde5b" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
