import { MigrationInterface, QueryRunner } from "typeorm";

export class FixSubscriptionCourseRelation1763317089605 implements MigrationInterface {
    name = 'FixSubscriptionCourseRelation1763317089605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_4a0ae68c88b001ac251064bb9d5"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_4a0ae68c88b001ac251064bb9d5" FOREIGN KEY ("subjectId") REFERENCES "cource_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_4a0ae68c88b001ac251064bb9d5"`);
        await queryRunner.query(`ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_4a0ae68c88b001ac251064bb9d5" FOREIGN KEY ("subjectId") REFERENCES "subject_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
