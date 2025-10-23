import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStudentRelation1761224284606 implements MigrationInterface {
  name = "UpdateStudentRelation1761224284606";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_fe0bf579f0e9ef0c20d4a8f7fc3"`
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_entity" RENAME COLUMN "studentId" TO "userId"`
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_1de6c48093b2c28a389d94ee2f8" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscription_entity" DROP CONSTRAINT "FK_1de6c48093b2c28a389d94ee2f8"`
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_entity" RENAME COLUMN "userId" TO "studentId"`
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_entity" ADD CONSTRAINT "FK_fe0bf579f0e9ef0c20d4a8f7fc3" FOREIGN KEY ("studentId") REFERENCES "student_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
