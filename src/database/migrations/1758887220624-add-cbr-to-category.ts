import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCbrToCategory1758887220624 implements MigrationInterface {
    name = 'AddCbrToCategory1758887220624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_entity" ADD "CBR_chapter" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_entity" DROP COLUMN "CBR_chapter"`);
    }

}
