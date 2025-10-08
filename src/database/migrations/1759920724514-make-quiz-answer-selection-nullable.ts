import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeQuizAnswerSelectionNullable1759920724514 implements MigrationInterface {
    name = 'MakeQuizAnswerSelectionNullable1759920724514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_answer_entity" ALTER COLUMN "selectedAnswer" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_answer_entity" ALTER COLUMN "selectedAnswer" SET NOT NULL`);
    }

}
