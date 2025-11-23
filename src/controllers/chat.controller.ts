import type { NextFunction, Request, Response } from "express";
import ChatService from "../services/chat.service";
import { emitToUser } from "../sockets";
import { getAuthenticatedUserId } from "../utils/getAuthenticatedUserId";

class ChatController {
  static async createPrivateChat(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = getAuthenticatedUserId(req);
      const { otherUserId } = req.body;

      const chat = await ChatService.createPrivateChat(userId, otherUserId);

      const io = req.app.get("io");
      emitToUser(io, otherUserId, "chat:created", chat);
      emitToUser(io, userId, "chat:created", chat);

      res.status(201).json({
        status: "success",
        message: "Chat privado criado com sucesso!",
        data: {
          chat: chat,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  static async createGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);
      const { title, members } = req.body;

      const chat = await ChatService.createGroupChat(userId, title, members);

      const io = req.app.get("io");
      members.forEach((memberId: string) => {
        emitToUser(io, memberId, "chat:created", chat);
      });

      res.status(201).json({
        status: "success",
        message: "Chat criado com sucesso!",
        data: {
          chat: chat,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  static async listUserChats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);

      const chats = await ChatService.listUserChats(userId);

      res.status(201).json({
        status: "success",
        message: "Chats encontrados com sucesso!",
        data: {
          chats: chats,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  static async updateChat(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);
      const { chatId } = req.params;
      const { title } = req.body;

      const chat = await ChatService.updateChat(String(chatId), userId, title);

      req.app.get("io").to(chat.id).emit("chat:updated", chat);

      res.status(200).json({
        status: "success",
        message: "Chat atualizado com sucesso",
        data: {
          chat,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);
      const { chatId } = req.params;

      const chat = await ChatService.getById(String(chatId), userId);

      res.status(200).json({
        status: "success",
        message: "Chat encontrado com sucesso",
        data: {
          chat,
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
      const { chatId } = req.params;

      await ChatService.deleteChat(String(chatId), userId);

      req.app.get("io").to(chatId).emit("chat:deleted", { cahtId: chatId });

      res.status(200).json({
        status: "success",
        message: "Chat deletado com sucesso",
      });
      return;
    } catch (error) {
      next(error);
    }
  }
}

export default ChatController;
