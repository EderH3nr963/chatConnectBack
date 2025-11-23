export default class AppError extends Error {
  public statusCode: number;
  public status: string;

  constructor(message: string, statusCode = 400, status = "error") {
    super(message);

    this.statusCode = statusCode;
    this.status = status;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
