export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details: any

    constructor(message: string, statusCode: number, isOperational = true, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this)
    }

}

// Not Found Error
export class NotFoundError extends AppError {
    constructor(message = "Resources not found") {
        super(message, 404);
    }
}

// validation Error (use for joi/zod/react-hook-form validation errors)
export class ValidationError extends AppError {
    constructor(message = "Invalid Request Data", details?: any) {
        super(message, 400, true, details)        
    }
}

// authentication Error
export class AuthError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401)        
    }
}

// Forbidden Error (For Insufficient Permission)
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden Error") {
        super(message, 403)        
    }
}

// Database Error (For MongoDB/ Postgres Errors)
export class DatabaseError extends AppError {
    constructor(message = "Database Error", details?: any) {
        super(message, 500, true, details)        
    }
}

// Rate Limit Error (For Insufficient Permission)
export class rateLimitError extends AppError {
    constructor(message = "Too many requests, please try again later") {
        super(message, 429)        
    }
}


