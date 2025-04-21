import 'reflect-metadata';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOwnerSchema1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SCHEMA IF NOT EXISTS owner;

      CREATE TABLE IF NOT EXISTS owner.tenants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) UNIQUE NOT NULL,
        schema_name VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS owner.tenants;
      DROP SCHEMA IF EXISTS owner;
    `);
  }
}
