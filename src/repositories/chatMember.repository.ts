import { prisma } from "../config/prisma";

const chatMemberInclude = {
  user: {
    select: {
      id: true,
      username: true,
    },
  },
};

interface IAddMember {
  chatId: string;
  userId: string;
  role?: "admin" | "member";
}

class ChatMemberRepository {
  static async addMember(data: IAddMember) {
    return prisma.chatMember.create({
      data,
      include: chatMemberInclude,
    });
  }

  static async findByChatId(chatId: string) {
    return prisma.chatMember.findMany({
      where: { chatId },
      include: chatMemberInclude,
      orderBy: { joinedAt: "asc" },
    });
  }

  static async findByUserId(userId: string) {
    return prisma.chatMember.findMany({
      where: { userId },
      include: {
        chat: true,
      },
    });
  }

  static async findMember(chatId: string, userId: string) {
    return prisma.chatMember.findFirst({
      where: { chatId, userId },
      include: chatMemberInclude,
    });
  }

  static async updateRole(memberId: string, role: "admin" | "member") {
    return prisma.chatMember.update({
      where: { id: memberId },
      data: { role },
      include: chatMemberInclude,
    });
  }

  static async removeMember(memberId: string) {
    return prisma.chatMember.delete({
      where: { id: memberId },
    });
  }

  static async leaveChat(chatId: string, userId: string) {
    return prisma.chatMember.deleteMany({
      where: { chatId, userId },
    });
  }
}

export default ChatMemberRepository;
