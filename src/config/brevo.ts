import * as brevo from "@getbrevo/brevo";

export class Brevo {
  private apiInstance: brevo.TransactionalEmailsApi;
  private sendSmtpEmail: brevo.SendSmtpEmail;

  constructor() {
    this.apiInstance = new brevo.TransactionalEmailsApi();

    const apiKey = process.env.BREVO_API_KEY || "";

    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey
    );

    this.sendSmtpEmail = new brevo.SendSmtpEmail();
  }

  async SendEmail(
    emailTo: { email: string; name: string },
    subject: string,
    htmlMessage: string
  ): Promise<void> {
    try {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || "";
      const senderEmailName = process.env.BREVO_SENDER_NAME || "";

      this.sendSmtpEmail.subject = subject;
      this.sendSmtpEmail.htmlContent = `<html><body>${htmlMessage}</body></html>`;
      this.sendSmtpEmail.sender = { name: senderEmailName, email: senderEmail };
      this.sendSmtpEmail.to = [
        {
          email: emailTo.email,
          name: emailTo.name,
        },
      ];

      await this.apiInstance.sendTransacEmail(this.sendSmtpEmail);
    } catch (e: any) {
      console.error(e);
    }
  }
}
