import { RabbitMQ } from "../../config/rabbitmq";

export class NotificationProducer {
  static async SendNotificationToQueue(
    queue: string,
    message: object
  ): Promise<void> {
    const rabbitMQ = new RabbitMQ();
    const channel = await rabbitMQ.GetChannel();

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));

      await channel?.assertQueue(queue, { durable: true });

      channel?.sendToQueue(queue, messageBuffer);
    } catch (e: any) {
      console.error("Erro ao enviar mensagem para a fila:", e.message);
    } finally {
      await channel?.close();
      await rabbitMQ.Disconnect();
    }
  }
}
