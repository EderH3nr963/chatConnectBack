import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import app from "./app";
import socketInit from "./sockets";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

import routes from "./routes";
app.use("/api/v1", routes);

// Middleware global de erros
import handlerError from "./middlewares/handlerError";
app.use(handlerError);

socketInit(io);

httpServer.listen(PORT, HOST, () => {
  console.log(`Servidor iniciado em http://${HOST}:${PORT}`);
});
