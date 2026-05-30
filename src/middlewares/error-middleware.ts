import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/app-error';

 export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    const message =
      process.env.NODE_ENV === 'production'
        ? err.isPublic
          ? err.publicMessage ?? err.message
          : 'Something went wrong'
        : err.message;

    return res.status(err.statusCode).json({
      success: false,
      error: {
        message,
        code: err.code,
        statusCode: err.statusCode,
      },
    });
  }

  console.error('UNEXPECTED ERROR:', err);

  return res.status(500).json({
    success: false,
    error: {
      message:
        process.env.NODE_ENV === 'production'
          ? 'Something went wrong'
          : err.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    },
  });
}