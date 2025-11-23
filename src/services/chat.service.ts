import AppError from "../utils/AppError";
import ChatRepository from "../repositories/chat.repository";
import ChatMemberRepository from "../repositories/chatMember.repository";
import ChatMemberService from "./chatMember.service";

class ChatService {
  static async createPrivateChat(userId: string, otherUserId: string) {
    if (userId === otherUserId) {
      throw new AppError("Você não pode criar um chat consigo mesmo", 400);
    }

    const existingChat = await ChatRepository.findPrivateBetweenUsers(
      userId,
      otherUserId
    );

    if (existingChat) return existingChat;

    const chat = await ChatRepository.create({
      type: "private",
      createdBy: userId,
    });

    await ChatMemberRepository.addMember({
      chatId: chat.id,
      userId,
      role: "member",
    });

    await ChatMemberRepository.addMember({
      chatId: chat.id,
      userId: otherUserId,
      role: "member",
    });

    return chat;
  }

  static async createGroupChat(
    userId: string,
    title: string,
    members: string[]
  ) {
    if (!title) {
      throw new AppError("Grupos precisam de um título", 400);
    }

    const chat = await ChatRepository.create({
      type: "group",
      title,
      createdBy: userId,
    });

    // Criador vira admin
    await ChatMemberRepository.addMember({
      chatId: chat.id,
      userId,
      role: "admin",
    });

    // Adiciona os outros membros
    for (const memberId of members) {
      await ChatMemberRepository.addMember({
        chatId: chat.id,
        userId: memberId,
        role: "member",
      });
    }

    return chat;
  }

  static async getById(chatId: string, userId: string) {
    await ChatMemberService.ensureUserInChat(chatId, userId);

    const chat = await ChatRepository.findById(chatId);
    if (!chat) throw new AppError("Chat não encontrado", 404);

    return chat;
  }

  static async listUserChats(userId: string) {
    const chats = await ChatRepository.findUserChats(userId);

    return chats;
  }

  static async updateChat(
    chatId: string,
    userId: string,
    data: { title?: string }
  ) {
    const member = await ChatMemberService.ensureUserInChat(chatId, userId);

    ChatMemberService.ensureAdmin(member);

    const chat = await ChatRepository.update(chatId, data);

    return chat;
  }

  static async deleteChat(chatId: string, userId: string) {
    const member = await ChatMemberService.ensureUserInChat(chatId, userId);

    ChatMemberService.ensureAdmin(member);

    await ChatRepository.delete(chatId);

    return true;
  }
}

export default ChatService;
