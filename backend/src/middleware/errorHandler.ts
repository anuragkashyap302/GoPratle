import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[API Error]:', err);

  // Handle Zod Schema Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed for requirement submission',
      errors: formattedErrors
    });
    return;
  }

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Invalid format for field: ${err.path}`,
      error: 'Resource not found or bad request identifier'
    });
    return;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el: any) => ({
      field: el.path,
      message: el.message
    }));

    res.status(400).json({
      success: false,
      message: 'Database validation failed',
      errors
    });
    return;
  }

  // Generic 500 Server Error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
}
