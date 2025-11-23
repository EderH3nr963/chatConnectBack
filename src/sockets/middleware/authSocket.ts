import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export default function authSocket(socket: Socket, next: any) {
  try {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.token;

    if (!token) {
      return next(new Error("Token não fornecido"));
    }

    const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta";

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    socket.data.userId = decoded.id;

    next();
  } catch (err) {
    next(new Error("Token inválido"));
  }
}
