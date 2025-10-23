import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentTable1761229289724 implements MigrationInterface {
    name = 'AddPaymentTable1761229289724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, "paymentId" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_6c397c81035bd5b42d16ef3bc70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment_entity" ADD CONSTRAINT "FK_5fd2756650ddadbc8c96be6106a" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_entity" DROP CONSTRAINT "FK_5fd2756650ddadbc8c96be6106a"`);
        await queryRunner.query(`DROP TABLE "payment_entity"`);
    }

}
