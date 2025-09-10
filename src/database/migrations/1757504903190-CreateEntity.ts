import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEntity1757504903190 implements MigrationInterface {
    name = 'CreateEntity1757504903190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'STUDENT', "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subject_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_734a0e904b21f0008952e5848bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "school_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_41976c69228356dc32b3ca94093" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "school_student_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "schoolId" character varying NOT NULL, "studentId" character varying NOT NULL, "subjectId" character varying NOT NULL, "categoryId" character varying NOT NULL, "enrolmentDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_6bef7355a9b91e0258abc2591fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questions_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "question" character varying NOT NULL, "option_A" character varying NOT NULL, "option_B" character varying NOT NULL, "option_C" character varying NOT NULL, "option_D" character varying NOT NULL, "correct_answer" character varying NOT NULL, "explanation" character varying NOT NULL, "subscription_level" character varying NOT NULL, "is_exam_question" boolean NOT NULL, "difficulty" character varying NOT NULL, "CBR_chapter" character varying NOT NULL, CONSTRAINT "PK_6b23b23fa8308924320d63d7ad6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_1a38b9007ed8afab85026703a53" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "category_entity"`);
        await queryRunner.query(`DROP TABLE "questions_entity"`);
        await queryRunner.query(`DROP TABLE "school_student_entity"`);
        await queryRunner.query(`DROP TABLE "school_entity"`);
        await queryRunner.query(`DROP TABLE "subject_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}
