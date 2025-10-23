import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStudentTable1761216388144 implements MigrationInterface {
  name = "UpdateStudentTable1761216388144";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_entity" DROP CONSTRAINT "UQ_fbc4ce908216414023a757c750e"`
    );
    await queryRunner.query(`ALTER TABLE "student_entity" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "student_entity" DROP COLUMN "firstName"`
    );
    await queryRunner.query(
      `ALTER TABLE "student_entity" DROP COLUMN "lastName"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_entity" ADD "lastName" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "student_entity" ADD "firstName" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "student_entity" ADD "email" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "student_entity" ADD CONSTRAINT "UQ_fbc4ce908216414023a757c750e" UNIQUE ("email")`
    );
  }
}
