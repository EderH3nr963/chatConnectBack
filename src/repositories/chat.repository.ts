import { prisma } from "../config/prisma";

const chatInclude = {
  members: {
    include: {
      user: {
        select: { id: true, username: true },
      },
    },
  },
};

interface ICreateChat {
  type: "private" | "group";
  title?: string;
  createdBy: string;
}

class ChatRepository {
  static async create(data: ICreateChat) {
    return prisma.chat.create({
      data,
      include: chatInclude,
    });
  }

  static async findById(chatId: string) {
    return prisma.chat.findUnique({
      where: { id: chatId },
      include: chatInclude,
    });
  }

  static async findPrivateBetweenUsers(userA: string, userB: string) {
    return prisma.chat.findFirst({
      where: {
        type: "private",
        AND: [
          {
            members: {
              some: { userId: userA },
            },
          },
          {
            members: {
              some: { userId: userB },
            },
          },
        ],
      },
      include: chatInclude,
    });
  }

  static async findByCreator(userId: string) {
    return prisma.chat.findMany({
      where: { createdBy: userId },
      include: chatInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  static async findUserChats(userId: string) {
    return prisma.chat.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: chatInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  static async update(chatId: string, data: Partial<ICreateChat>) {
    return prisma.chat.update({
      where: { id: chatId },
      data,
      include: chatInclude,
    });
  }

  static async delete(chatId: string) {
    return prisma.chat.delete({
      where: { id: chatId },
    });
  }
}

export default ChatRepository;
