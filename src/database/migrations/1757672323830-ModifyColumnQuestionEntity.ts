import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyColumnQuestionEntity1757672323830 implements MigrationInterface {
    name = 'ModifyColumnQuestionEntity1757672323830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" ALTER COLUMN "Mobility" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" ALTER COLUMN "Mobility" SET NOT NULL`);
    }

}
