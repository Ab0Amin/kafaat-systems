import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1745251099380 implements MigrationInterface {
    name = 'InitialMigration1745251099380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP CONSTRAINT "tenants_domain_key"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "domain"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "domain" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD CONSTRAINT "UQ_da4054294eaae43ec7f85b6a3a1" UNIQUE ("domain")`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP CONSTRAINT "tenants_schema_name_key"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "schema_name"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "schema_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD CONSTRAINT "UQ_c2a961556326eec0e3b19f3ced5" UNIQUE ("schema_name")`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ALTER COLUMN "created_at" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP CONSTRAINT "UQ_c2a961556326eec0e3b19f3ced5"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "schema_name"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "schema_name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD CONSTRAINT "tenants_schema_name_key" UNIQUE ("schema_name")`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP CONSTRAINT "UQ_da4054294eaae43ec7f85b6a3a1"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "domain"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "domain" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD CONSTRAINT "tenants_domain_key" UNIQUE ("domain")`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "name" character varying(255) NOT NULL`);
    }

}
