import { Server } from "socket.io";
import http from "http";
import { NotificationWebSocket } from "../models/notification.model";
import logger from "../config/logger";

export class WebSocketIO {
  private static io: Server | null = null;
  private static userSocketMap = new Map<string, string>();

  static Initialize(server: http.Server): void {
    try {
      logger.info("Socket inicializado");

      this.io = new Server(server, {
        cors: {
          origin: "*", // Em produção, configurar corretamente a origem
          methods: ["GET", "POST"],
        },
      });

      this.io.on("connection", s => {
        const usuario = s.handshake.query.usuario as string;

        if (usuario) {
          this.userSocketMap.set(usuario, s.id);
        }
        logger.info(`Cliente conectado: usuário: ${usuario}`);

        s.on("disconnect", () => {
          this.userSocketMap.delete(usuario);
          logger.info(`Cliente ${usuario} desconectado.`);
        });
      });
    } catch (e: any) {
      logger.error(e.message);
    }
  }

  static GetSocketIO(): Server {
    if (!this.io) {
      throw new Error("Socket.IO não está inicializado");
    }

    return this.io;
  }

  static async ProcessNotification(
    notification: NotificationWebSocket
  ): Promise<void> {
    try {
      const io = this.GetSocketIO();

      const notificationJson = JSON.stringify(notification);
      const id = this.userSocketMap.get(notification.To || "");

      //O usuário foi enviado mas não está conectado
      if (!id && notification.To)
        throw new Error("Usuário de destino não está conectado");

      if (id) {
        io.to(id).emit("notification", notificationJson);
        logger.info(
          `Websocket enviada de ${notification.From} para ${notification.To} com sucesso!`
        );
      } else {
        io.emit("notification", notificationJson);
        logger.info(
          `Websocket enviada de ${notification.From} para todos com sucesso!`
        );
      }
    } catch (e: any) {
      logger.error(e.message);
    }
  }
}
