import { validationResult } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import AppError from "../../utils/AppError";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0]?.msg;

    throw new AppError(errorMessage, 400);
  }

  next();
};
