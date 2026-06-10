class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
  isPublic: boolean;
  publicMessage?: string;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    options?: {
      isPublic?: boolean;
      publicMessage?: string;
    },
  ) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;

    this.isOperational = true;
    this.isPublic = options?.isPublic ?? true;
    this.publicMessage = options?.publicMessage;

    Error.captureStackTrace(this, this.constructor);
  }
}
export default AppError;
