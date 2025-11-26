import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserRepository } from "../repositories/user.repository";
import AppError from "../utils/AppError";
import type { UserWithoutPassword } from "../types/user";
import { sendEmail } from "../utils/sendEmail";

const SECRET_KEY = process.env.JWT_SECRET || "chave_super_secreta";

interface UpdateEmailPayload extends jwt.JwtPayload {
  newEmail: string;
  userId: string;
}

class UserService {
  static async requireUser(userId: string): Promise<UserWithoutPassword> {
    const user = await UserRepository.findByIdWithoutPassword(userId);
    if (!user) throw new AppError("Usuário não encontrado ou inexistente", 401);

    return user;
  }

  static async getById(userId: string): Promise<UserWithoutPassword> {
    const user = await this.requireUser(userId);

    return user;
  }

  static async requestUpdateEmail(
    userId: string,
    newEmail: string
  ): Promise<boolean> {
    await this.requireUser(userId);

    const emailExists = await UserRepository.findByEmail(newEmail);
    if (emailExists) throw new AppError("Este email já está em uso", 409);

    // Token enviado ao novo email
    const token = jwt.sign({ userId, newEmail }, SECRET_KEY, {
      expiresIn: "5m",
    });

    const confirmUrl = `${process.env.FRONTEND_URL}/confirm-new-email?token=${token}`;

    const html = `
      <h2>Confirmação de Novo Email</h2>
      <p>Você solicitou a alteração do seu email no <strong>Chat Connect</strong>.</p>
      
      <p>Para confirmar seu novo email (<strong>${newEmail}</strong>), clique no botão abaixo:</p>
  
      <a href="${confirmUrl}" style="
        background: #4f46e5;
        color: white;
        padding: 10px 15px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
      ">Confirmar novo email</a>
  
      <p style="margin-top: 20px;">
        Caso você não tenha solicitado essa alteração, basta ignorar este email.
      </p>
  
      <p>Este link expira em <strong>5 minutos</strong>.</p>
    `;

    // Envia para o *novo email* para confirmar que ele é válido
    await sendEmail(
      newEmail,
      "Confirmação de novo email - Chat Connect",
      html
    );

    return true;
  }


  static async updateEmail(
    userId: string,
    token: string
  ): Promise<UserWithoutPassword> {
    await this.requireUser(userId);

    let decoded: UpdateEmailPayload;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as UpdateEmailPayload;
    } catch {
      throw new AppError("Token inválido ou expirado", 401);
    }

    if (userId !== decoded.userId)
      throw new AppError(
        "Você não possui autorização para alterar o email de terceiros",
        403
      );

    const user = await UserRepository.updateById(userId, {
      email: decoded.newEmail,
    });

    return user;
  }

  static async updatePassword(
    userId: string,
    password: string
  ): Promise<boolean> {
    await this.requireUser(userId);

    const hashPassword = await bcrypt.hash(password, 10);

    await UserRepository.updateById(userId, {
      hash_password: hashPassword,
    });

    return true;
  }

  static async updateUsername(
    userId: string,
    username: string
  ): Promise<UserWithoutPassword> {
    await this.requireUser(userId);

    const usernameExists = await UserRepository.findByUsername(username);
    if (usernameExists && usernameExists.id !== userId)
      throw new AppError("Nome de usuário já está em uso", 409);

    const user = await UserRepository.updateById(userId, {
      username: username,
    });

    return user;
  }

  static async delete(userId: string): Promise<boolean> {
    await this.requireUser(userId);

    await UserRepository.softDelete(userId);

    return true;
  }
}

export default UserService;
