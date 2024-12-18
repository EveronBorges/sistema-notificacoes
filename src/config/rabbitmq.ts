import amqplib from "amqplib";

export class RabbitMQ {
  private url: string | null = null;
  private connection: amqplib.Connection | null = null;

  constructor() {
    this.url = process.env.RABBITMQ_URL || "";
  }

  async Connect(): Promise<void> {
    try {
      if (!this.url) {
        throw new Error("RABBITMQ_URL não está configurada no arquivo .env");
      }

      if (!this.connection) {
        this.connection = await amqplib.connect(this.url);
      }
    } catch (e: any) {
      throw e;
    }
  }

  async GetChannel(): Promise<amqplib.Channel | undefined> {
    await this.Connect();

    const channel = await this.connection?.createChannel();

    return channel;
  }

  async Disconnect(): Promise<void> {
    if (this.connection) {
      this.connection.close();
    }
  }
}
