import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuizTables1759901237328 implements MigrationInterface {
    name = 'AddQuizTables1759901237328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quiz_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, "isPractice" boolean NOT NULL DEFAULT false, "startedAt" TIMESTAMP NOT NULL DEFAULT now(), "studentId" uuid, "categoryId" uuid, "answersId" uuid, CONSTRAINT "REL_0835e37deb3fe143f12759bde5" UNIQUE ("categoryId"), CONSTRAINT "PK_49aa5018c097da2f6c16121c4f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_answer_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "selectedAnswer" character varying NOT NULL, "quizId" uuid, "questionId" uuid, CONSTRAINT "PK_40115cba532721882b14fe7fc4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD "quizAnswerId" uuid`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" ADD CONSTRAINT "FK_1fdb0e8a369c39cc23e82d3c0d7" FOREIGN KEY ("studentId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" ADD CONSTRAINT "FK_0835e37deb3fe143f12759bde5b" FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" ADD CONSTRAINT "FK_7901f2fc48119c4d97ba7255962" FOREIGN KEY ("answersId") REFERENCES "quiz_answer_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_answer_entity" ADD CONSTRAINT "FK_704b9c421eaedcf0d3e06237128" FOREIGN KEY ("quizId") REFERENCES "quiz_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_answer_entity" ADD CONSTRAINT "FK_ee361c4714006e89e2224f07323" FOREIGN KEY ("questionId") REFERENCES "questions_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions_entity" ADD CONSTRAINT "FK_1df7cc58726f88ce2308aa3c1e2" FOREIGN KEY ("quizAnswerId") REFERENCES "quiz_answer_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP CONSTRAINT "FK_1df7cc58726f88ce2308aa3c1e2"`);
        await queryRunner.query(`ALTER TABLE "quiz_answer_entity" DROP CONSTRAINT "FK_ee361c4714006e89e2224f07323"`);
        await queryRunner.query(`ALTER TABLE "quiz_answer_entity" DROP CONSTRAINT "FK_704b9c421eaedcf0d3e06237128"`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" DROP CONSTRAINT "FK_7901f2fc48119c4d97ba7255962"`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" DROP CONSTRAINT "FK_0835e37deb3fe143f12759bde5b"`);
        await queryRunner.query(`ALTER TABLE "quiz_entity" DROP CONSTRAINT "FK_1fdb0e8a369c39cc23e82d3c0d7"`);
        await queryRunner.query(`ALTER TABLE "questions_entity" DROP COLUMN "quizAnswerId"`);
        await queryRunner.query(`DROP TABLE "quiz_answer_entity"`);
        await queryRunner.query(`DROP TABLE "quiz_entity"`);
    }

}
