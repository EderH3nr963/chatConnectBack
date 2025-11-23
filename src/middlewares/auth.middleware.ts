import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "chave_super_secreta";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (!token) throw new AppError("Token não fornecido", 401);

    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    next(error);
  }
}
