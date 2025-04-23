# Database Migrations Guide

This document explains how database migrations work in the Kafaat HR Core system and how to troubleshoot common issues.

## Migration Architecture

The system uses TypeORM migrations to manage database schema changes:

1. **Owner Schema**: Contains tenant metadata tables
2. **Public Schema**: Used as a template for tenant schemas
3. **Tenant Schemas**: Each tenant gets its own schema with tables copied from the public schema

## Migration Commands

```bash
# Generate a new migration
npm run migration:generate

# Run migrations on the owner and public schemas
npm run migration:run

# Revert the last migration
npm run migration:revert

# Initialize the database (run all migrations)
npm run db:init
```

## Tenant Schema Creation

When a new tenant is registered:

1. A new schema is created with the tenant's name (slugified)
2. Tables are copied from the public schema to the new tenant schema
3. Tenant metadata is stored in the owner schema

## Troubleshooting

### Common Issues

1. **Migration Fails to Run**: 
   - Check that the database connection parameters are correct in `.env`
   - Ensure the database user has permission to create schemas and tables
   - Verify that the migration files are properly formatted

2. **No Changes Detected When Generating Migrations**:
   - This happens when the database schema matches the entity definitions
   - If you've made changes to entities but no migration is generated, try:
     - Dropping the database and recreating it
     - Manually creating a migration file
     - Checking that your entity changes are properly saved

3. **Tenant Registration Fails at Migration Step**:
   - The system now copies tables from the public schema instead of running migrations
   - Ensure the public schema has all required tables
   - Check database permissions

## Best Practices

1. **Always Run Migrations on Development First**:
   - Test migrations in development before applying to production
   - Create a backup before running migrations in production

2. **Keep Migrations Idempotent**:
   - Use `IF NOT EXISTS` in your SQL statements
   - Check for existing objects before creating them

3. **Handle Schema Updates Carefully**:
   - When updating the public schema, consider how to update existing tenant schemas
   - Create a script to apply schema changes to all tenant schemas if needed