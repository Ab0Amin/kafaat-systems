export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  code?: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface ValidationError {
  property: string;
  constraints: Record<string, string>;
  children?: ValidationError[];
}

export interface ValidationErrorResponse extends ErrorResponse {
  validationErrors: ValidationError[];
}