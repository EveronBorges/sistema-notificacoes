import amqplib from "amqplib";
import logger from "../config/logger";
import dotenv from "dotenv";

export class RabbitMQ {
  private url: string | null = null;
  private connection: amqplib.Connection | null = null;

  constructor(url: string | null = null) {
    dotenv.config();

    this.url = url ?? (process.env.RABBITMQ_URL || "");
  }

  async Connect(): Promise<void> {
    try {
      if (!this.url) {
        throw new Error("RABBITMQ_URL não está configurada no arquivo .env");
      }

      if (!this.connection) {
        this.connection = await amqplib.connect(this.url);

        logger.info("RabbitMQ conectado com sucesso.");
      }
    } catch (e: any) {
      logger.error(`Ocorreu um erro ao conectar ao RabbitMQ: ${e.message}`);
      throw e;
    }
  }

  async GetChannel(): Promise<amqplib.Channel | undefined> {
    await this.Connect();

    return await this.connection?.createChannel();
  }

  async Disconnect(): Promise<void> {
    if (this.connection) {
      this.connection.close();
      logger.info("RabbitMQ desconectado.");
    }
  }
}
