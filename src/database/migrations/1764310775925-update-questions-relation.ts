import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateQuestionsRelation1764310775925 implements MigrationInterface {
    name = 'UpdateQuestionsRelation1764310775925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "course_id" uuid`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD CONSTRAINT "FK_9b7a8c2cb6875518e75cb9e8a20" FOREIGN KEY ("course_id") REFERENCES "cource_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP CONSTRAINT "FK_9b7a8c2cb6875518e75cb9e8a20"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "course_id"`);
    }

}
