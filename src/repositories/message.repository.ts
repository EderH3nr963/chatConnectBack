import { prisma } from "../config/prisma";

const messageInclude = {
  sender: {
    select: {
      id: true,
      username: true,
    },
  },
};

interface ICreateMessage {
  chatId: string;
  senderId: string;
  content: string;
}

class MessageRepository {
  static async create(data: ICreateMessage) {
    return prisma.message.create({
      data,
      include: messageInclude,
    });
  }

  static async findPaginated(chatId: string, limit = 20, cursor?: string) {
    return prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "desc" }, // mensagens mais recentes primeiro
      take: limit,

      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),

      include: messageInclude,
    });
  }

  static async findByContent(content: string, chatId: string) {
    return prisma.message.findMany({
      where: { content: { contains: content }, chatId },
      include: messageInclude,
    });
  }

  static async findByChatId(chatId: string) {
    return prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      include: messageInclude,
    });
  }

  static async findById(messageId: string) {
    return prisma.message.findUnique({
      where: { id: messageId },
      include: messageInclude,
    });
  }

  static async updateContent(messageId: string, content: string) {
    return await prisma.message.update({
      where: { id: messageId },
      data: { content },
      include: messageInclude,
    });
  }

  static async hardDelete(messageId: string) {
    return await prisma.message.delete({ where: { id: messageId } });
  }
}

export default MessageRepository;
