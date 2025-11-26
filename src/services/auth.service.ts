import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserRepository } from "../repositories/user.repository";
import AppError from "../utils/AppError";
import { removePassword } from "../utils/removePassword";
import { sendEmail } from "../utils/sendEmail";

const SECRET_KEY = process.env.JWT_SECRET || "chave_super_secreta";

interface RegisterParamaters {
  username: string;
  email: string;
  password: string;
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

    // Gera token de atualização válido por 5 minutos
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "5m",
    });

    // Link de reset (frontend)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Corpo do email
    const html = `
      <h2>Recuperação de Senha</h2>
      <p>Olá <strong>${user.username}</strong>,</p>
      <p>Recebemos uma solicitação para alterar sua senha.</p>
      <p>Clique no link abaixo para continuar:</p>
  
      <a href="${resetUrl}" style="
          background: #4f46e5;
          color: white;
          padding: 10px 15px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
      ">Redefinir Senha</a>
  
      <p style="margin-top: 20px;">Se você não fez esta solicitação, ignore este email.</p>
      <p>Este link expira em <strong>5 minutos</strong>.</p>
    `;

    // Envia o email
    await sendEmail(
      user.email,
      "Redefinição de senha - Chat Connect",
      html
    );

    return true;
  }

}

export default AuthService;
