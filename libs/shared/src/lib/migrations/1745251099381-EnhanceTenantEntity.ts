import { MigrationInterface, QueryRunner } from "typeorm";

export class EnhanceTenantEntity1745251099381 implements MigrationInterface {
    name = 'EnhanceTenantEntity1745251099381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns to the tenants table
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "plan" character varying`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "maxUsers" integer`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "settings" jsonb`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "contactEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "contactPhone" character varying`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the new columns
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "contactPhone"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "contactEmail"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "settings"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "maxUsers"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "plan"`);
        await queryRunner.query(`ALTER TABLE "owner"."tenants" DROP COLUMN "isActive"`);
    }
}