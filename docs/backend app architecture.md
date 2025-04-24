# Multi-Tenant Architecture Implementation

I've implemented a comprehensive multi-tenant architecture for the Kafaat HR Core system. 

## Architecture Overview

The system uses a schema-based multi-tenancy approach with PostgreSQL:

1. **Owner Schema**: Stores tenant metadata and global configuration
2. **Template Schema**: Contains tables and data to be cloned for new tenants
3. **Tenant Schemas**: Each tenant gets its own PostgreSQL schema with isolated data

## Role-Based Access Control

I've implemented three main roles:

1. **Owner Role**: Global superuser with full access to all schemas
2. **Admin Role**: Scoped to a single schema (tenant)
3. **User/Manager Roles**: Regular users with limited access within their tenant

## Key Components

### 1. Entity Structure

- **Role Entity**: Defines the role types (OWNER, ADMIN, MANAGER, USER)
- **User Entity**: Updated to include role and schema information
- **Tenant Entity**: Stores tenant metadata in the owner schema
- **TemplateConfig Entity**: Configures which tables to clone from template schema

### 2. Tenant Context Management

- **TenantContextService**: Maintains the current tenant context throughout the request lifecycle
- **SchemaAccessGuard**: Enforces role-based access control for schemas

### 3. Subdomain-Based Access Control

- **SubdomainMiddleware**: Extracts tenant information from the subdomain:
  - Main domain (example.com): Owner role
  - Owner subdomain (owner.example.com): Owner role
  - Tenant subdomains (tenant1.example.com): Admin role for that tenant

### 4. Template Schema Cloning

- **TemplateSchemaService**: Handles cloning tables and data from template schema to new tenant schemas
- Configurable via TemplateConfig entity to specify which tables to clone

## Workflow

### Tenant Registration Process

1. User submits tenant registration form with company name, domain, and admin details
2. System creates a new schema with the tenant's name (slugified)
3. System clones tables and data from template schema to the new tenant schema
4. System creates an admin user for the tenant with ADMIN role
5. System stores tenant metadata in the owner schema

### Request Handling

1. Request comes in with a subdomain (e.g., tenant1.example.com)
2. SubdomainMiddleware extracts tenant information from the subdomain
3. TenantContextService sets the current tenant context
4. SchemaAccessGuard enforces role-based access control
5. Database operations use the correct schema based on the tenant context

### Development and Testing

For development and testing, the system supports:

1. Using the `x-user-role` header to override the role
2. Using the `x-schema-name` header to override the schema
3. Using different subdomains to test different tenants
4. Environment variables for default schema and tenant

## Code Structure

### Entity Definitions

- **Role Entity**: Defines the role types and permissions
- **User Entity**: Includes role and schema information
- **Tenant Entity**: Stores tenant metadata
- **TemplateConfig Entity**: Configures template cloning

### Services

- **TenantService**: Handles tenant registration and management
- **TemplateSchemaService**: Handles template schema cloning
- **TenantContextService**: Maintains tenant context

### Middleware and Guards

- **SubdomainMiddleware**: Extracts tenant from subdomain
- **TenantMiddleware**: Ensures database operations use correct schema
- **SchemaAccessGuard**: Enforces role-based access control

### Documentation

- **multi-tenant-architecture.md**: Explains the multi-tenant architecture
- **database-migrations.md**: Explains database migration process

