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

  async AssertQueue(queue: string): Promise<void> {
    try {
      await this.Connect();

      const channel = await this.GetChannel();

      await channel?.assertQueue(queue, { durable: true });
      console.log(`Fila "${queue}" criada com sucesso!`);

      await channel?.close();
      process.exit(0);
    } catch (e: any) {
      console.error("Erro na queue do RabbitMQ", e.message);
      process.exit(1);
      //throw e;
    }
  }
}
