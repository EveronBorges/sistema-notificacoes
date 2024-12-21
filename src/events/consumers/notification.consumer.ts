import { Brevo } from "../../utils/brevo";
import logger from "../../config/logger";
import { RabbitMQ } from "../../utils/rabbitmq";
import { WebSocketIO } from "../../utils/socket";
import {
  NotificationQueue,
  NotificationEmail,
} from "../../models/notification.model";

export class NotificationConsumer {
  static async Start(queue: string): Promise<void> {
    const rabbitMQ = new RabbitMQ();
    const channel = await rabbitMQ.GetChannel();

    try {
      await channel?.assertQueue(queue, { durable: true });

      logger.info(`Iniciando a fila ${queue}`);
      logger.info(`Aguardando mensagens na fila "${queue}"...`);

      channel?.consume(
        queue,
        async message => {
          if (message) {
            const content = JSON.parse((message?.content || "").toString());

            logger.info(`Mensagem recebida para a fila: ${queue}`);

            await this.Process(queue, content);

            channel.ack(message);
          }
        },
        { noAck: false }
      );
    } catch (e: any) {
      logger.error(`Erro no consumer : ${e.message}`);
      await channel?.close();
      await rabbitMQ.Disconnect();
    }
  }

  static async Process(queue: string, content: any): Promise<void> {
    switch (queue) {
      case NotificationQueue.Email:
        const { Email, Name, Subject, Message } = content as NotificationEmail;

        const brevo = new Brevo();
        await brevo.SendEmail({ email: Email, name: Name }, Subject, Message);

        break;
      case NotificationQueue.SMS:
        break;
      case NotificationQueue.Push:
        break;
      case NotificationQueue.Websocket:
        await WebSocketIO.ProcessNotification(content);

        break;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
