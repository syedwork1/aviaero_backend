import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveEmailInStudentTable1760701911314 implements MigrationInterface {
    name = 'RemoveEmailInStudentTable1760701911314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_entity" DROP COLUMN "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_entity" ADD "password" character varying NOT NULL`);
    }

}
