import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImagesInQuestion1759147372504 implements MigrationInterface {
    name = 'AddImagesInQuestion1759147372504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "img_1" character varying`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "img_2" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "img_2"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "img_1"`);
    }

}
