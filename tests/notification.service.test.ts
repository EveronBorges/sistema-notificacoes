import { Brevo } from "../src/utils/brevo";

jest.mock("../src/utils/brevo");

const mockSendMail = jest.fn();

describe("NotificationService", () => {
  beforeEach(() => {
    mockSendMail.mockClear();
    Brevo.prototype.SendEmail = mockSendMail;
  });

  it("Chama a função SendEmail com os parâmetros corretos", async () => {
    const emailTo = {
      email: "user@example.com",
      name: "Usuário Teste de Envio de Emails",
    };
    const subject = "Nova Notificação!";
    const htmlMessage = `<h1>Olá, ${emailTo.name}</h1><p>Você tem uma nova notificação no sistema.</p>`;

    const brevo = new Brevo();
    await brevo.SendEmail(emailTo, subject, htmlMessage);

    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenLastCalledWith(
      emailTo,
      subject,
      htmlMessage
    );
  });

  it("Deve lançar um erro caso o envio de email falhe", async () => {
    const errorMessage = "Erro no envio de e-mail";
    mockSendMail.mockRejectedValue(new Error(errorMessage));

    const emailTo = {
      email: "user@example.com",
      name: "Usuário Teste de Envio de Emails",
    };
    const subject = "Nova Notificação!";
    const htmlMessage = `<h1>Olá, ${emailTo.name}</h1><p>Você tem uma nova notificação no sistema.</p>`;

    const brevo = new Brevo();

    await expect(
      brevo.SendEmail(emailTo, subject, htmlMessage)
    ).rejects.toThrow(errorMessage);
  });
});
