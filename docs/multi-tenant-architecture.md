# Multi-Tenant Architecture

This document describes the multi-tenant architecture implemented in the Kafaat HR Core system.

## Overview

The system uses a schema-based multi-tenancy approach with PostgreSQL:

1. **Owner Schema**: Stores tenant metadata and global configuration
2. **Template Schema**: Contains tables and data to be cloned for new tenants
3. **Tenant Schemas**: Each tenant gets its own PostgreSQL schema with isolated data

## Roles and Permissions

### Owner Role

- Global superuser with full access to all schemas
- Can create, delete, and update schemas
- Can access and manage all data across schemas
- Typically accessed via the main domain or owner.example.com

### Admin Role

- Scoped to a single schema (tenant)
- Has full access within their assigned schema only
- Cannot access or modify other schemas
- Typically accessed via their tenant subdomain (e.g., tenant1.example.com)

### Manager Role

- Scoped to a single schema (tenant)
- Has limited administrative capabilities within their schema
- Defined in the template schema and cloned to each tenant

### User Role

- Regular user with basic access
- Scoped to a single schema (tenant)
- Defined in the template schema and cloned to each tenant

## Subdomain-Based Access Control

The system uses subdomains to determine the current tenant and role:

1. **Main Domain** (example.com): Defaults to Owner role with access to all schemas
2. **Owner Subdomain** (owner.example.com): Explicitly sets Owner role
3. **Tenant Subdomains** (tenant1.example.com): Sets Admin role for that tenant's schema

## Implementation Details

### Middleware

1. **SubdomainMiddleware**: Extracts tenant information from the subdomain and sets the schema context
2. **TenantMiddleware**: Ensures database operations use the correct schema

### Guards

1. **SchemaAccessGuard**: Enforces role-based access control for schemas

### Template Schema Cloning

When a new tenant is registered:

1. A new schema is created with the tenant's name (slugified)
2. Tables and data are copied from the template schema
3. An admin user is created for the tenant
4. Tenant metadata is stored in the owner schema

## Testing Without Authentication

For development and testing, you can:

1. Use the `x-user-role` header to override the role
2. Use the `x-schema-name` header to override the schema
3. Use different subdomains to test different tenants

## Local Development

For local development, you can use:

1. **localhost subdomains**: tenant1.localhost:3000, tenant2.localhost:3000
2. **Environment variables**:
   - `DEFAULT_SCHEMA`: Default schema to use when none is specified
   - `DEFAULT_TENANT`: Default tenant to use when none is specified
   - `SKIP_SCHEMA_ACCESS_CONTROL`: Set to "true" to bypass schema access control in development

## Database Migrations

See [Database Migrations Guide](./database-migrations.md) for details on how to manage database schema changes across tenants.
