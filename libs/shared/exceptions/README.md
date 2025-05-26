# Exceptions

This library provides a centralized exception handling system for the Kafaat Systems application.

## Features

- Custom exception classes for different error types
- Global exception filter for consistent error responses
- Error logging and formatting utilities
- HTTP exception handling
- Database exception handling
- Validation exception handling

## Usage

Import the `ExceptionsModule` in your application module:

```typescript
import { ExceptionsModule } from '@kafaat-systems/exceptions';

@Module({
  imports: [
    ExceptionsModule.forRoot(),
    // other imports
  ],
})
export class AppModule {}
```

Throw custom exceptions in your code:

```typescript
import { BadRequestException, NotFoundException } from '@kafaat-systems/exceptions';

// In a service or controller
if (!user) {
  throw new NotFoundException('User not found');
}

if (!isValid(data)) {
  throw new BadRequestException('Invalid data provided');
}
```

## Exception Types

- `BadRequestException`: For invalid input data
- `UnauthorizedException`: For authentication failures
- `ForbiddenException`: For authorization failures
- `NotFoundException`: For resources that don't exist
- `ConflictException`: For conflicts with existing resources
- `InternalServerException`: For unexpected server errors
- `DatabaseException`: For database-related errors
- `ValidationException`: For validation failures
- `TenantException`: For tenant-related errors