import ChatMemberService from "../../services/chatMember.service";
import { Server, Socket } from "socket.io";

export const chatEvents = (io: Server, socket: Socket) => {
  socket.on("chat:join", async (chatId: string) => {
    const userId = socket.data.userId;

    const canJoin = await ChatMemberService.ensureUserInChat(userId, chatId);
    if (!canJoin) {
      socket.emit("chat:error", {
        message: "Você não pode entrar neste chat.",
      });
      return;
    }

    socket.join(chatId);
    console.log(`${socket.id} entrou na sala ${chatId}`);
    socket.to(chatId).emit("chat:userJoined", { userId });
  });
};
