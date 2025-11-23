import ChatMemberRepository from "../repositories/chatMember.repository";
import AppError from "../utils/AppError";

class ChatMemberService {
  static async ensureUserInChat(chatId: string, userId: string) {
    const member = await ChatMemberRepository.findMember(chatId, userId);

    if (!member) throw new AppError("Usuário não participa deste chat", 403);

    return member;
  }

  static ensureAdmin(member: { role: string }) {
    if (member.role !== "admin")
      throw new AppError(
        "Apenas administradores podem realizar esta ação",
        403
      );
  }

  static async addMember(
    chatId: string,
    userId: string,
    role: "admin" | "member" = "member",
    requestingUserId: string
  ) {
    const requester = await this.ensureUserInChat(chatId, requestingUserId);
    this.ensureAdmin(requester);

    const exists = await ChatMemberRepository.findMember(chatId, userId);
    if (exists) throw new AppError("Usuário já está no chat", 400);

    return ChatMemberRepository.addMember({
      chatId,
      userId,
      role,
    });
  }

  static async listMembers(chatId: string, requestingUserId: string) {
    await this.ensureUserInChat(chatId, requestingUserId);

    return ChatMemberRepository.findByChatId(chatId);
  }

  static async listUserChats(userId: string) {
    return ChatMemberRepository.findByUserId(userId);
  }

  static async updateRole(
    chatId: string,
    memberId: string,
    newRole: "admin" | "member",
    requestingUserId: string
  ) {
    const requester = await this.ensureUserInChat(chatId, requestingUserId);
    this.ensureAdmin(requester);

    return ChatMemberRepository.updateRole(memberId, newRole);
  }

  static async removeMember(
    chatId: string,
    memberId: string,
    requestingUserId: string
  ) {
    const requester = await this.ensureUserInChat(chatId, requestingUserId);
    this.ensureAdmin(requester);

    return ChatMemberRepository.removeMember(memberId);
  }

  static async leaveChat(chatId: string, userId: string) {
    return ChatMemberRepository.leaveChat(chatId, userId);
  }
}

export default ChatMemberService;
