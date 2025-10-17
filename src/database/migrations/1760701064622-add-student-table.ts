import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStudentTable1760701064622 implements MigrationInterface {
    name = 'AddStudentTable1760701064622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "student_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_fbc4ce908216414023a757c750e" UNIQUE ("email"), CONSTRAINT "REL_79d3f39e7ae4d5b6ba2e254838" UNIQUE ("userId"), CONSTRAINT "PK_fca1c1cc9adc7aea54a40e70e88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "student_entity" ADD CONSTRAINT "FK_79d3f39e7ae4d5b6ba2e2548383" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_entity" DROP CONSTRAINT "FK_79d3f39e7ae4d5b6ba2e2548383"`);
        await queryRunner.query(`DROP TABLE "student_entity"`);
    }

}
