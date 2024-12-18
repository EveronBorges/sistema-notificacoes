import { NotificationProducer } from "./events/producers/notification.producer";
import { INotificationEmail, NotificationQueue } from "./config/rabbitmq";
import moment from "moment";
import dotenv from "dotenv";

(async () => {
  dotenv.config();

  const message = {
    TemplateId: "notification_email",
    Email: "everon.borges@gmail.com",
    Name: "Éveron Usuario",
    Subject: "Confirmação de agendamento",
    Message: `<p>Confirmação de agendamento no dia ${moment(new Date()).format(
      "LLLL"
    )}.</p>`,
  } as INotificationEmail;

  await NotificationProducer.SendNotificationToQueue(
    NotificationQueue.Email,
    message
  );
  process.exit(0);
})();
