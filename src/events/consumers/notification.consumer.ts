import { Brevo } from "../../utils/brevo";
import logger from "../../config/logger";
import { RabbitMQ } from "../../utils/rabbitmq";
import { WebSocketIO } from "../../utils/socket";
import {
  NotificationQueue,
  NotificationEmail,
} from "../../models/notification.model";
import amqplib from "amqplib";

export class NotificationConsumer {
  private rabbitMQ: RabbitMQ;
  private channel: amqplib.Channel | undefined;
  private isChannelClosed: boolean = false;

  constructor() {
    this.rabbitMQ = new RabbitMQ();
  }

  async Start(queue: string): Promise<void> {
    try {
      this.channel = await this.rabbitMQ.GetChannel();
      await this.channel?.assertQueue(queue, { durable: true });

      logger.info(`Iniciando a fila ${queue}`);
      logger.info(`Aguardando mensagens na fila "${queue}"...`);

      this.channel?.consume(
        queue,
        async message => {
          if (message) {
            const content = JSON.parse((message?.content || "").toString());

            logger.info(`Mensagem recebida para a fila: ${queue}`);

            await this.Process(queue, content);

            if (this.channel && !this.isChannelClosed) {
              this.channel?.ack(message);
            }
          }
        },
        { noAck: false }
      );
    } catch (e: any) {
      logger.error(`Erro no consumer : ${e.message}`);
      await this.channel?.close();
      await this.rabbitMQ.Disconnect();
    }
  }

  async Stop(queue: string): Promise<void> {
    try {
      logger.info(`Parando a fila ${queue}`);

      if (this.channel) {
        await this.channel.cancel(queue);

        try {
          await this.channel.checkQueue(queue);
          await this.channel.deleteQueue(queue);
          await this.channel.close();

          this.isChannelClosed = true;
        } catch (e: any) {
          logger.info(e.message);
        }
      }

      await this.rabbitMQ.Disconnect();
    } catch (e: any) {
      logger.error(`Erro ao parar a fila: ${e.message}`);
    }
  }

  async Process(queue: string, content: any): Promise<void> {
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
      case NotificationQueue.Test:
        logger.info("Queue de teste");
        break;
      default:
        logger.warn("Queue não encontrada");
        break;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
