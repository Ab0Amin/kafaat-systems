import { MigrationInterface, QueryRunner } from "typeorm";
import { RoleType } from "@kafaat-systems/entities";

export class CreateTemplateSchema1745500000000 implements MigrationInterface {
    name = 'CreateTemplateSchema1745500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create template schema
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "template"`);

        // Create roles table in template schema
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "template"."roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" character varying NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_template_roles_id" PRIMARY KEY ("id")
            )
        `);

        // Insert default roles in template schema
        await queryRunner.query(`
            INSERT INTO "template"."roles" ("name", "description")
            VALUES 
                ('${RoleType.ADMIN}', 'Administrator with full access to the tenant schema'),
                ('${RoleType.MANAGER}', 'Manager with limited administrative capabilities'),
                ('${RoleType.USER}', 'Regular user with basic access')
            ON CONFLICT DO NOTHING
        `);

        // Create template_configs table in owner schema
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "owner"."template_configs" (
                "id" SERIAL NOT NULL,
                "tableName" character varying NOT NULL,
                "schemaName" character varying NOT NULL,
                "copyStructure" boolean NOT NULL DEFAULT true,
                "copyData" boolean NOT NULL DEFAULT true,
                "priority" integer NOT NULL DEFAULT 0,
                "options" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_template_configs_id" PRIMARY KEY ("id")
            )
        `);

        // Insert default template configurations
        await queryRunner.query(`
            INSERT INTO "owner"."template_configs" ("tableName", "schemaName", "copyStructure", "copyData", "priority")
            VALUES 
                ('roles', 'template', true, true, 10)
            ON CONFLICT DO NOTHING
        `);

        // Create enum type for roles if it doesn't exist
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roletype') THEN
                    CREATE TYPE "roletype" AS ENUM ('${RoleType.OWNER}', '${RoleType.ADMIN}', '${RoleType.MANAGER}', '${RoleType.USER}');
                END IF;
            END
            $$;
        `);

        // Update users table to include role column
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN IF NOT EXISTS "role" "roletype" NOT NULL DEFAULT '${RoleType.USER}',
            ADD COLUMN IF NOT EXISTS "schemaName" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove role column from users table
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN IF EXISTS "role",
            DROP COLUMN IF EXISTS "schemaName"
        `);

        // Drop template_configs table
        await queryRunner.query(`DROP TABLE IF EXISTS "owner"."template_configs"`);

        // Drop roles table in template schema
        await queryRunner.query(`DROP TABLE IF EXISTS "template"."roles"`);

        // Drop template schema
        await queryRunner.query(`DROP SCHEMA IF EXISTS "template" CASCADE`);

        // Drop roletype enum
        await queryRunner.query(`DROP TYPE IF EXISTS "roletype"`);
    }
}