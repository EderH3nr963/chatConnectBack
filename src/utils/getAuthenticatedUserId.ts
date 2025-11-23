import type { Request } from "express";
import AppError from "./AppError";

export function getAuthenticatedUserId(req: Request): string {
  if (!req.user || !req.user.id) {
    throw new AppError("Usuário não autenticado", 401);
  }

  return req.user.id;
}
