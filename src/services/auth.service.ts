import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserRepository } from "../repositories/user.repository";
import AppError from "../utils/AppError";
import { removePassword } from "../utils/removePassword";
import type { UserWithoutPassword } from "../types/user";

const SECRET_KEY = process.env.JWT_SECRET || "chave_super_secreta";

interface RegisterParamaters {
  username: string;
  email: string;
  password: string;
}

interface LoginReturn {
  user: UserWithoutPassword;
  token: string;
}

class AuthService {
  static async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);

    if (!user) throw new AppError("Email ou senha inválidos.", 401);

    const passwordValid = await bcrypt.compare(password, user.hash_password);
    if (!passwordValid) throw new AppError("Email ou senha inválidos.", 401);

    const userWithoutPassword = removePassword(user);
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "48h" });

    return {
      token,
      user: userWithoutPassword,
    };
  }

  static async register(userParamaters: RegisterParamaters) {
    const hashPassword = await bcrypt.hash(userParamaters.password, 10);

    const existing = await UserRepository.checkExisting(
      userParamaters.email,
      userParamaters.username
    );
    if (existing) throw new AppError("Email ou username já está em uso.", 409);

    await UserRepository.create({
      email: userParamaters.email,
      username: userParamaters.username,
      hash_password: hashPassword,
    });

    return true;
  }

  static async requestUpdatePassword(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AppError("Usuário não encontrado ou inexistente", 401);

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "5m",
    });

    // Enviar um link de redefinição de senha junto com o token como parametro no email

    return true;
  }
}

export default AuthService;
