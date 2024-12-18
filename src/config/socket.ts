import { Server } from "socket.io";
import http from "http";

export class WebSocketIO {
  private static io: Server | null = null;

  static Initialize(server: http.Server): void {
    try {
      console.log("Socket inicializado");

      this.io = new Server(server, {
        cors: {
          origin: "*", // Em produção, configurar corretamente a origem
          methods: ["GET", "POST"],
        },
      });

      this.io.on("connection", s => {
        console.log(`Cliente conectado: ${s.id}`);

        s.on("disconnect", () => {
          console.log(`Cliente disconectado: ${s.id}`);
        });
      });
    } catch (e: any) {
      console.error(e);
    }
  }

  static GetSocketIO(): Server {
    if (!this.io) {
      throw new Error("Socket.IO não está inicializado");
    }

    return this.io;
  }

  static async ProcessNotification(notification: any): Promise<void> {
    try {
      console.log("Entrou");

      const io = this.GetSocketIO();

      io.emit("notification", notification);

      console.log("Notificação enviada via WebSocket:", notification);
    } catch (e: any) {
      console.log(e);
    }
  }
}
