import {
  Notification,
  NotificationQueue,
} from "../src/models/notification.model";
import { NotificationProducer } from "../src/events/producers/notification.producer";
import { NotificationConsumer } from "../src/events/consumers/notification.consumer";

describe("RabbitMQ", () => {
  const notificationConsumer = new NotificationConsumer();

  beforeAll(async () => {
    await notificationConsumer.Start(NotificationQueue.Test);
  });

  afterAll(async () => {
    await notificationConsumer.Stop(NotificationQueue.Test);
  });

  it("Enviar Mensagem para a fila", async () => {
    const message: Notification = {
      Type: NotificationQueue.Test,
      Data: {
        Email: "email@teste.com",
        Name: "Test",
        Subject: "Test",
        Message: "Test",
      },
    };

    await NotificationProducer.SendNotificationToQueue(
      NotificationQueue.Test,
      message
    );
  });
});
