import { MigrationInterface, QueryRunner } from "typeorm";

export class FeedbackTableUpdate1759994030147 implements MigrationInterface {
  name = "FeedbackTableUpdate1759994030147";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" DROP CONSTRAINT "FK_7c4c065ead761cc4f5ad8eaba63"`
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" DROP CONSTRAINT "FK_734702787a1c17e5562d57dddab"`
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" DROP CONSTRAINT "FK_ba4c575a0955fcff806ca4e9e03"`
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" DROP COLUMN "categoryId"`
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" DROP COLUMN "examId"`
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" DROP COLUMN "subjectId"`
    );
    await queryRunner.query(`ALTER TABLE "feedback_entity" ADD "quizId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" ADD CONSTRAINT "FK_f8f154f3ea5d92c3631a1e01de8" FOREIGN KEY ("quizId") REFERENCES "quiz_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" DROP CONSTRAINT "FK_f8f154f3ea5d92c3631a1e01de8"`
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" DROP COLUMN "quizId"`
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" ADD "subjectId" uuid`
    );
    await queryRunner.query(`ALTER TABLE "feedback_entity" ADD "examId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" ADD "categoryId" uuid`
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" ADD CONSTRAINT "FK_ba4c575a0955fcff806ca4e9e03" FOREIGN KEY ("subjectId") REFERENCES "subject_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" ADD CONSTRAINT "FK_734702787a1c17e5562d57dddab" FOREIGN KEY ("examId") REFERENCES "exam_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" ADD CONSTRAINT "FK_7c4c065ead761cc4f5ad8eaba63" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
