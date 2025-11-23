import MessageRepository from "../repositories/message.repository";
import ChatMemberService from "./chatMember.service";
import AppError from "../utils/AppError";

interface CreateMessageDTO {
  chatId: string;
  senderId: string;
  content: string;
}

class MessageService {
  static async authorizeMessageModification(
    userId: string,
    messageId: string,
    role: "member" | "admin"
  ) {
    const message = await MessageRepository.findById(messageId);

    if (!message)
      throw new AppError("Mensagem inexistente ou não encontrada", 404);

    const isAuthor = message.senderId === userId;
    const isAdmin = role === "admin";

    if (!isAuthor && !isAdmin)
      throw new AppError(
        "Você não possui permissão para modificar essa mensagem",
        403
      );

    return message;
  }

  static async create(messageData: CreateMessageDTO) {
    const message = await MessageRepository.create(messageData);

    return message;
  }

  static async getAllOfChat(chatId: string, userId: string) {
    await ChatMemberService.ensureUserInChat(chatId, userId);

    const messages = await MessageRepository.findByChatId(chatId);

    return messages;
  }

  static async getMessagesPaginated(
    chatId: string,
    limit = 20,
    cursor?: string
  ) {
    if (!chatId) {
      throw new AppError("Chat não informado.", 400);
    }

    const messages = await MessageRepository.findPaginated(
      chatId,
      limit,
      cursor
    );

    const newCursor =
      messages.length > 0 ? (messages[messages.length - 1]?.id ?? null) : null;

    return {
      messages,
      nextCursor: newCursor,
      hasMore: messages.length === limit,
    };
  }

  static async getByContent(content: string, chatId: string, userId: string) {
    await ChatMemberService.ensureUserInChat(chatId, userId);

    const messages = await MessageRepository.findByContent(content, chatId);

    return messages;
  }

  static async updateContent(
    content: string,
    messageId: string,
    userId: string,
    chatId: string
  ) {
    const chatMember = await ChatMemberService.ensureUserInChat(chatId, userId);

    await this.authorizeMessageModification(userId, messageId, chatMember.role);

    const message = await MessageRepository.updateContent(messageId, content);

    return message;
  }

  static async delete(
    messageId: string,
    userId: string,
    chatId: string
  ): Promise<boolean> {
    const chatMember = await ChatMemberService.ensureUserInChat(chatId, userId);

    const message = await this.authorizeMessageModification(
      userId,
      messageId,
      chatMember.role
    );

    if (message.chatId !== chatId)
      throw new AppError(
        "Você não tem autorização para fazer qualquer alteração nesse chat",
        403
      );

    await MessageRepository.hardDelete(messageId);

    return true;
  }
}

export default MessageService;
