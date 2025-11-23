import MessageService from "../../services/message.service";
import { Server, Socket } from "socket.io";
import AppError from "../../utils/AppError";

export function messageEvent(io: Server, socket: Socket) {
  socket.on(
    "message:send",
    async ({ chatId, content }: { chatId: string; content: string }) => {
      try {
        const userId = socket.data.userId;
        if (!userId) throw new Error("Usuário não autenticado");

        const message = await MessageService.create({
          chatId,
          senderId: userId,
          content,
        });

        io.to(chatId).emit("message:new", message);

        socket.emit("message:sent", { status: "success", message });
      } catch (error) {
        console.error(
          `[Socket] Erro ao enviar mensagem: ${(error as Error).message}`
        );
        socket.emit("message:error", {
          message: "Não foi possível enviar a mensagem",
        });
      }
    }
  );

  socket.on(
    "message:update",
    async ({
      chatId,
      messageId,
      content,
    }: {
      chatId: string;
      messageId: string;
      content: string;
    }) => {
      try {
        const userId = socket.data.userId;
        if (!userId) throw new Error("Usuário não autenticado");

        const message = await MessageService.updateContent(
          content,
          messageId,
          userId,
          chatId
        );

        io.to(chatId).emit("message:updated", message);

        socket.emit("message:update", { status: "success", message });
      } catch (error) {
        console.error(
          `[Socket] Erro ao atualizar mensagem: ${(error as Error).message}`
        );
        socket.emit("message:error", {
          message: "Não foi possível atualizar a mensagem",
        });
      }
    }
  );

  socket.on(
    "message:delete",
    async ({ chatId, messageId }: { chatId: string; messageId: string }) => {
      try {
        const userId = socket.data.userId;
        if (!userId) throw new Error("Usuário não autenticado");

        await MessageService.delete(messageId, userId, chatId);

        io.to(chatId).emit("message:deleted", { messageId });

        socket.emit("message:deleted", { status: "success", messageId });
      } catch (error) {
        console.error(
          `[Socket] Erro ao deletar mensagem: ${(error as Error | AppError).message}`
        );
        socket.emit("message:error", {
          message: "Não foi possível deletar a mensagem",
        });
      }
    }
  );
}
