import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyCourceEntity1758005795961 implements MigrationInterface {
    name = 'ModifyCourceEntity1758005795961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cource_entity" RENAME COLUMN "category" TO "categoryId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cource_entity" RENAME COLUMN "categoryId" TO "category"`);
    }

}
