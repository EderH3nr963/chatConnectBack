import type { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import { getAuthenticatedUserId } from "../utils/getAuthenticatedUserId";

class UserController {
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);

      const user = await UserService.getById(userId);

      res.status(200).json({
        status: "success",
        message: "Usuário encontrado com sucesso",
        data: {
          user: user,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  static async requestUpdateEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = getAuthenticatedUserId(req);
      const { newEmail } = req.body;

      await UserService.requestUpdateEmail(userId, newEmail);

      res.status(200).json({
        status: "success",
        message:
          "Email de confirmação enviado. Verifique sua caixa de entrada.",
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  static async confirmUpdateEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = getAuthenticatedUserId(req);
      const { token } = req.query;

      const updatedUser = await UserService.updateEmail(userId, String(token));

      res.status(200).json({
        status: "success",
        message: "Email atualizado com sucesso!",
        user: updatedUser,
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  static async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);
      const { password } = req.body;

      await UserService.updatePassword(userId, password);

      res.status(200).json({
        status: "success",
        message: "Senha alterada com sucesso",
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  static async updateUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);
      const { username } = req.body;

      const user = await UserService.updateUsername(userId, username);

      res.status(200).json({
        status: "success",
        message: "Nome de usuário alterada com sucesso",
        data: {
          user: user,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);

      await UserService.delete(userId);

      res.status(200).json({
        status: "success",
        message: "Usuário deletado com sucesso",
      });
      return;
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
