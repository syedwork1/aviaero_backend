import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarInUsers1762340036226 implements MigrationInterface {
    name = 'AddAvatarInUsers1762340036226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "avatar"`);
    }

}
