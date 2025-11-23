import type { NextFunction, Request, Response } from "express";
import ChatMemberService from "../services/chatMember.service";
import { emitToUser } from "../sockets/";
import { getAuthenticatedUserId } from "../utils/getAuthenticatedUserId";

class ChatMemberController {
  static async listMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const requestingUserId = getAuthenticatedUserId(req);

      const members = await ChatMemberService.listMembers(
        String(chatId),
        requestingUserId
      );

      res.json({
        status: "success",
        message: "Membros encontrados com sucesso",
        data: { members },
      });
    } catch (error) {
      next(error);
    }
  }

  static async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const { userId, role } = req.body;

      const requestingUserId = getAuthenticatedUserId(req);

      const member = await ChatMemberService.addMember(
        String(chatId),
        userId,
        role,
        requestingUserId
      );

      const io = req.app.get("io");

      // Notifica todos no chat
      io.to(chatId).emit("chat:new-member", { member, chatId });

      // Notifica o usuário adicionado
      emitToUser(io, userId, "chat:added", { chatId, role });

      res.status(201).json({
        status: "success",
        message: "Membro adicionado com sucesso",
        data: { member },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId, memberId } = req.params;
      const { newRole } = req.body;

      const requestingUserId = getAuthenticatedUserId(req);

      const updatedMember = await ChatMemberService.updateRole(
        String(chatId),
        String(memberId),
        newRole,
        requestingUserId
      );

      const io = req.app.get("io");

      io.to(chatId).emit("chat:role-updated", {
        chatId,
        memberId,
        newRole,
      });

      emitToUser(io, String(memberId), "chat:your-role-updated", {
        chatId,
        newRole,
      });

      res.json({
        status: "success",
        message: "Função do membro atualizada com sucesso",
        data: { member: updatedMember },
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId, memberId } = req.params;
      const requestingUserId = getAuthenticatedUserId(req);

      await ChatMemberService.removeMember(
        String(chatId),
        String(memberId),
        requestingUserId
      );

      const io = req.app.get("io");

      // Notifica todos no chat
      io.to(chatId).emit("chat:removed-member", {
        memberId,
        chatId,
      });

      // Notifica o membro removido
      emitToUser(io, String(memberId), "chat:removed-member", {
        chatId,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async leaveChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const userId = getAuthenticatedUserId(req);

      await ChatMemberService.leaveChat(String(chatId), userId);

      const io = req.app.get("io");

      io.to(chatId).emit("chat:leaved", {
        userId,
        chatId,
      });

      emitToUser(io, userId, "chat:you-leaved", { chatId });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async listUserChats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);
      const chats = await ChatMemberService.listUserChats(userId);

      res.json({
        status: "success",
        message: "Chats do usuário encontrados com sucesso",
        data: { chats },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ChatMemberController;
