export class NotificationQueue {
  public static readonly Email: string = "notifications.email";
  public static readonly SMS: string = "notifications.sms";
  public static readonly Push: string = "notifications.push";
  public static readonly Websocket: string = "notifications.websocket";
  public static readonly Test: string = "notifications.test";
}

export interface NotificationEmail {
  Email: string;
  Name: string;
  Subject: string;
  Message: string;
}

export interface NotificationWebSocket {
  From: string;
  To: string | null;
  Title: string;
  Message: string;
}

export interface Notification {
  Type: string;
  Data: NotificationEmail | NotificationWebSocket | null;
}
