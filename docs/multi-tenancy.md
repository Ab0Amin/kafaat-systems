# Multi-Tenancy Implementation in Kafaat HR Core

This document describes the multi-tenancy implementation in the Kafaat HR Core system.

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

### Admin Operations

- **Admin Module**: Provides cross-tenant operations like migrations and statistics
- **Tenant Configuration**: Allows tenant-specific settings

## Tenant Lifecycle

1. **Registration**: Creates a new schema and initializes it with tables
2. **Activation/Deactivation**: Controls tenant access
3. **Deletion**: Removes tenant schema and metadata

## Security Considerations

- Tenant isolation through separate schemas
- Authentication and authorization per tenant
- Cross-tenant access prevention

## Performance Optimizations

- Connection pooling
- Tenant-aware caching (future enhancement)
- Efficient schema switching

## API Endpoints

### Tenant Management

- `POST /api/tenant/register` - Register a new tenant
- `GET /api/tenant` - List all tenants (admin only)
- `GET /api/tenant/:id` - Get tenant details (admin only)
- `PATCH /api/tenant/:id` - Update tenant (admin only)
- `POST /api/tenant/:id/deactivate` - Deactivate tenant (admin only)
- `DELETE /api/tenant/:id` - Delete tenant (admin only)

### Admin Operations

- `POST /api/admin/migrations/run-all` - Run migrations for all tenants (admin only)
- `GET /api/admin/stats` - Get tenant statistics (admin only)

## Future Enhancements

1. Tenant-specific customizations
2. Resource usage monitoring and quotas
3. Automated backups per tenant
4. Tenant data export/import
5. Improved tenant isolation with row-level security