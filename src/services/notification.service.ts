import { NotificationProducer } from "../events/producers/notification.producer";
import { Notification } from "../models/notification.model";

export class NotificationService {
  static async Create(notification: Notification): Promise<void> {
    try {
      const { Data, Type } = notification;

      await NotificationProducer.SendNotificationToQueue(Type, Data as object);
    } catch (e: any) {
      throw e;
    }
  }
}
