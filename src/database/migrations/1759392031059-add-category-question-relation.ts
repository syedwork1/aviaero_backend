import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryQuestionRelation1759392031059 implements MigrationInterface {
    name = 'AddCategoryQuestionRelation1759392031059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" RENAME COLUMN "Mobility" TO "mobilityId"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "mobilityId"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "mobilityId" uuid`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD CONSTRAINT "FK_01f08f4efd7f8c88cfcb30b7fb6" FOREIGN KEY ("mobilityId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP CONSTRAINT "FK_01f08f4efd7f8c88cfcb30b7fb6"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "mobilityId"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "mobilityId" character varying`);
        await queryRunner.query(`ALTER TABLE "questions_entity" RENAME COLUMN "mobilityId" TO "Mobility"`);
    }

}
