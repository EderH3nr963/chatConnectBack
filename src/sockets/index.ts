import { Server, Socket } from "socket.io";
import authSocket from "./middleware/authSocket";
import { chatEvents } from "./events/chat.event";
import { messageEvent } from "./events/message.event";

const userSockets = new Map<string, Set<string>>();

export default function socketInit(io: Server) {
  io.use(authSocket);

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;

    if (userId) {
      if (!userSockets.has(userId)) userSockets.set(userId, new Set());
      userSockets.get(userId)!.add(socket.id);

      console.log(
        `[Socket] Usuário ${userId} conectado com socket ${socket.id}`
      );
    } else {
      console.log(`[Socket] Socket ${socket.id} sem userId autenticado`);
    }

    chatEvents(io, socket);

    messageEvent(io, socket);

    socket.on("disconnect", () => {
      if (userId) {
        const sockets = userSockets.get(userId);
        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) userSockets.delete(userId);
        }
        console.log(
          `[Socket] Usuário ${userId} desconectou socket ${socket.id}`
        );
      } else {
        console.log(`Socket ${socket.id} desconectou`);
      }
    });
  });
}

export const emitToUser = (
  io: Server,
  userId: string,
  event: string,
  data: any
) => {
  const sockets = userSockets.get(userId);
  if (!sockets) return;
  sockets.forEach((socketId) => {
    io.to(socketId).emit(event, data);
  });
};
