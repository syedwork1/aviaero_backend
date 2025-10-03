import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeedbackTable1759495729269 implements MigrationInterface {
    name = 'AddFeedbackTable1759495729269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feedback_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "feedback" character varying NOT NULL, "rating" integer NOT NULL, "studentId" uuid, "categoryId" uuid, "examId" uuid, "subjectId" uuid, CONSTRAINT "PK_507ad6f30e7e6269fe648627dec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "feedback_entity" ADD CONSTRAINT "FK_be39716a9ae115beb36199904c2" FOREIGN KEY ("studentId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback_entity" ADD CONSTRAINT "FK_7c4c065ead761cc4f5ad8eaba63" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback_entity" ADD CONSTRAINT "FK_734702787a1c17e5562d57dddab" FOREIGN KEY ("examId") REFERENCES "exam_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback_entity" ADD CONSTRAINT "FK_ba4c575a0955fcff806ca4e9e03" FOREIGN KEY ("subjectId") REFERENCES "subject_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback_entity" DROP CONSTRAINT "FK_ba4c575a0955fcff806ca4e9e03"`);
        await queryRunner.query(`ALTER TABLE "feedback_entity" DROP CONSTRAINT "FK_734702787a1c17e5562d57dddab"`);
        await queryRunner.query(`ALTER TABLE "feedback_entity" DROP CONSTRAINT "FK_7c4c065ead761cc4f5ad8eaba63"`);
        await queryRunner.query(`ALTER TABLE "feedback_entity" DROP CONSTRAINT "FK_be39716a9ae115beb36199904c2"`);
        await queryRunner.query(`DROP TABLE "feedback_entity"`);
    }

}
