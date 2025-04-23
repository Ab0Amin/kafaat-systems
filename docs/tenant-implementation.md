# Multi-Tenant Implementation Guide

This document describes the multi-tenant implementation in the Kafaat HR Core system and how to troubleshoot common issues.

## Architecture Overview

The system uses a schema-based multi-tenancy approach with PostgreSQL:

1. **Owner Schema**: Stores tenant metadata (name, domain, schema_name, etc.)
2. **Tenant Schemas**: Each tenant gets its own PostgreSQL schema with isolated data
3. **Public Schema**: Used as a template for new tenant schemas

## Key Components

### Tenant Management

- **Tenant Entity**: Stores tenant metadata in the owner schema
- **Tenant Service**: Handles tenant registration, deactivation, and management
- **Tenant Middleware**: Resolves the current tenant from the request

### Tenant Context

- **Tenant Context Service**: Maintains tenant context throughout the request lifecycle
- **Database Connection**: Dynamic schema selection based on the current tenant

## Development Setup

1. Copy `.env.example` to `.env` and configure your database settings
2. For local development, set `DEFAULT_TENANT=public` to use the public schema
3. Create the owner schema in your database:
   ```sql
   CREATE SCHEMA IF NOT EXISTS owner;
   ```
4. Run migrations to create the necessary tables

## Troubleshooting

### Common Issues

1. **EntityMetadataNotFoundError**: This usually happens when the entity is not properly imported or registered. Make sure:
   - Entities are imported from `@kafaat-systems/entities`
   - Entities are included in the `entities_name` array
   - The schema exists in the database

2. **Tenant Not Found**: During development, you can:
   - Set `DEFAULT_TENANT` in your `.env` file
   - Use the `x-tenant-id` header in your requests
   - Check that the tenant exists in the owner schema

3. **Schema Not Found**: Make sure:
   - The schema exists in the database
   - The tenant record has the correct schema_name
   - The database user has permissions to access the schema

## API Endpoints

### Tenant Management

- `POST /api/tenant/register` - Register a new tenant
- `GET /api/tenant` - List all tenants (admin only)
- `POST /api/tenant/:id/deactivate` - Deactivate tenant (admin only)

## Testing

For testing, you can:

1. Use the `x-tenant-id` header to specify the tenant
2. Set `DEFAULT_TENANT` in your `.env` file
3. Create test tenants with the register endpoint