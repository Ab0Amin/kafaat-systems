import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTenantAndUserTables1745251099381 implements MigrationInterface {
    name = 'CreateTenantAndUserTables1745251099381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create owner schema if it doesn't exist
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "owner"`);

        // Create tenants table in owner schema
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "owner"."tenants" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "domain" character varying NOT NULL,
                "schema_name" character varying NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "plan" character varying,
                "maxUsers" integer,
                "settings" jsonb,
                "contactEmail" character varying,
                "contactPhone" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_tenants_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_tenants_domain" UNIQUE ("domain"),
                CONSTRAINT "UQ_tenants_schema_name" UNIQUE ("schema_name")
            )
        `);

        // Create admins table in owner schema
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "owner"."admins" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "email" character varying NOT NULL,
                "passwordHash" character varying NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_admins_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_admins_email" UNIQUE ("email")
            )
        `);

        // Create users table in public schema (template for tenant schemas)
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "lastName23" character varying NOT NULL DEFAULT 'new',
                "email" character varying NOT NULL,
                "passwordHash" character varying NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "tenantId" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables
        await queryRunner.query(`DROP TABLE IF EXISTS "owner"."tenants"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "owner"."admins"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }
}