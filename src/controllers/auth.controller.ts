import type { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";

class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, username, password } = req.body;

      await AuthService.register({ email, username, password });

      res.status(201).json({
        status: "success",
        message: "Usuário cadastrado com sucesso!",
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const { token, user } = await AuthService.login(email, password);

      res.status(200).json({
        status: "success",
        message: "Usuário logado com sucesso!",
        data: {
          token: token,
          user: user,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  static async requestUpdatePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;

      await AuthService.requestUpdatePassword(email);

      res.status(200).json({
        status: "success",
        message:
          "Email para troca de senha enviado. Verifique sua caixa de entrada.",
      });
      return;
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
