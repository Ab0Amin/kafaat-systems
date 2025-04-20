import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1745166392355 implements MigrationInterface {
    name = 'InitialMigration1745166392355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName2" character varying NOT NULL DEFAULT 'new'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName2"`);
    }

}
