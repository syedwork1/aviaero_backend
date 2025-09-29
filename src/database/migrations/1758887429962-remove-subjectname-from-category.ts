import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveSubjectnameFromCategory1758887429962 implements MigrationInterface {
    name = 'RemoveSubjectnameFromCategory1758887429962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cource_entity" DROP COLUMN "subjectName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cource_entity" ADD "subjectName" character varying NOT NULL`);
    }

}
