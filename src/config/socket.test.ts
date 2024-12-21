import { Server } from "http";
import { WebSocketIO } from "./socket";
import { io as Client } from "socket.io-client";

describe("WebSocketIO", () => {
  let server: Server;
  let port: number;

  beforeAll(done => {
    server = new Server();
    WebSocketIO.Initialize(server);
    server.listen(() => {
      const address = server.address();
      if (typeof address === "object" && address?.port) {
        port = address.port;
        done();
      }
    });
  });

  afterAll(done => {
    server.close(() => done());
  });

  it("Conectar um cliente com sucesso", done => {
    const client = Client(`http://localhost:${port}`, {
      query: { usuario: "usuario.teste" },
    });

    client.on("connect", () => {
      expect(client.id).toBeDefined();
      client.disconnect();
      done();
    });
  });

  it("Enviar uma mensagem para um usuário específico", done => {
    const usuario_01 = Client(`http://localhost:${port}`, {
      query: { usuario: "usuario.teste.01" },
    });

    usuario_01.on("connect", async () => {
      await WebSocketIO.ProcessNotification({
        From: "sistema",
        To: "usuario.teste.01",
        Title: "Titulo de teste",
        Message: "Mensagem de Teste",
      });
    });

    usuario_01.on("notification", message => {
      expect(message).toEqual(
        JSON.stringify({
          From: "sistema",
          To: "usuario.teste.01",
          Title: "Titulo de teste",
          Message: "Mensagem de Teste",
        })
      );
      usuario_01.disconnect();
      done();
    });
  });

  it("Enviar uma mensagem para todos os usuários", done => {
    const client_01 = Client(`http://localhost:${port}`, {
      query: { usuario: "usuario.teste.01" },
    });

    const client_02 = Client(`http://localhost:${port}`, {
      query: { usuario: "usuario.teste.02" },
    });

    client_02.on("connect", () => {
      WebSocketIO.ProcessNotification({
        From: "usuario.teste.02",
        To: null,
        Title: "Titulo de teste",
        Message: "Mensagem de Teste",
      });
    });

    [client_01, client_02].map((client, index) => {
      client.on("notification", message => {
        expect(message).toEqual(
          JSON.stringify({
            From: "usuario.teste.02",
            To: null,
            Title: "Titulo de teste",
            Message: "Mensagem de Teste",
          })
        );
        client.disconnect();

        if (index === 1) {
          done();
        }
      });
    });
  });
});
