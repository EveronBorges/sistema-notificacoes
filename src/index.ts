import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketIO } from "./utils/socket";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notification.route";
import { NotificationConsumer } from "./events/consumers/notification.consumer";
import { NotificationQueue } from "./models/notification.model";
import logger from "./config/logger";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api", [notificationRoutes]);

WebSocketIO.Initialize(server);

(async () => {
  const notificationConsumer = new NotificationConsumer();

  await notificationConsumer.Start(NotificationQueue.Email);
  await notificationConsumer.Start(NotificationQueue.Websocket);
})();

server.listen(3000, () => {
  logger.info("Server está rodando em http://localhost:3000");
});
