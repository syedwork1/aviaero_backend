import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeCbrCodeNullable1758886785266 implements MigrationInterface {
    name = 'MakeCbrCodeNullable1758886785266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" ALTER COLUMN "CBR_chapter" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" ALTER COLUMN "CBR_chapter" SET NOT NULL`);
    }

}
