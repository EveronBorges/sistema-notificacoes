import { RabbitMQ } from "./config/rabbitmq";
import dotenv from "dotenv";

(async () => {
  dotenv.config();

  const rabbit = new RabbitMQ();

  await rabbit.Connect();

  await rabbit.AssertQueue("FILA TESTE");

  await rabbit.Disconnect();
})();
