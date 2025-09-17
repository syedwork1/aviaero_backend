import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyExamEntity1758112919166 implements MigrationInterface {
    name = 'ModifyExamEntity1758112919166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_entity" ADD "end_date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam_entity" ADD "time" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_entity" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "exam_entity" DROP COLUMN "end_date"`);
    }

}
