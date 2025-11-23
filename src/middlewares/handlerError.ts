import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

export default function handlerError(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  console.error("[ERROR] \n", err);

  res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Internal server error",
  });
  return;
}
