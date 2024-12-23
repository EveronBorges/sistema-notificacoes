# Sistema de Notificações em Tempo Real

Este é um sistema de notificações em tempo real com suporte a e-mails, WebSockets e, futuramente, SMS e push notifications. Ele foi desenvolvido com TypeScript e integrações com RabbitMQ e Brevo (antigo SendinBlue) para envio de e-mails.

## Funcionalidades

- Envio de notificações por e-mail.
- Notificações em tempo real via WebSocket.
- Arquitetura baseada em eventos utilizando RabbitMQ.
- Logs centralizados usando Winston.

## Requisitos

- Node.js (v18 ou superior)
- RabbitMQ
- Um e-mail ativo no Brevo para configuração de envio de e-mails
- Redis (opcional para caching, se necessário)

## Configuração do Projeto

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/EveronBorges/sistema-notificacoes.git
   cd sistema-notificacoes
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:

   ```env
   NODE_ENV=<prod-ou-dev>
   RABBITMQ_URL=<url-do-rabbitmq>
   BREVO_API_KEY=<sua-chave-de-api-do-brevo>
   BREVO_SENDER_EMAIL=<seu-email-de-envio>
   BREVO_SENDER_NAME=<nome-do-remetente>
   ```

### Inicialização

1. Inicie o servidor:

   ```bash
   npm run serve
   ```

2. O sistema estará disponível em `http://localhost:3000`.

## Endpoints da API

### Enviar Notificação

- **Rota:** `POST /api/notifications/enviar`
- **Descrição:** Envia uma notificação por e-mail para um destinatário.
- **Payload: E-Mail**

  ```json
  {
    "Type": "notifications.email",
    "Data": {
      "Email": "E-mail destinatário",
      "Name": "Nome do destinatário",
      "Subject": "Assunto do e-mail",
      "Message": "Mensagem a ser enviada"
    }
  }
  ```

- **Descrição:** Envia uma notificação via websocket para um destinatário ou para todos usuários conectados.
- **Payload: Websocket**

  ```json
  {
    "Type": "notifications.websocket",
    "Data": {
      "From": "Usuário de origem",
      "To": "Usuário de destino (null caso seja para enviar para todos)",
      "Title": "Título da mensagem",
      "Message": "Mensagem a ser enviada"
    }
  }
  ```

- **Resposta:**

  ```text
  Notificação enviada
  ```

## Testes Automatizados

### Rodando os Testes

1. Execute os testes:

   ```bash
   npm test
   ```

2. Para testes com cobertura:

   ```bash
   npm run test:coverage
   ```

## Estrutura de Pastas

```plaintext
src/
├── config/             # Configurações do sistema
├── controllers/        # Controladores das rotas da API
├── events/             # Eventos de envio e recebimento de notificações
├── middlewares/        # Middleware que valida um usuário e gera o token
├── models/             # Modelos de dados
├── routes/             # Rota(s) do endpoint
├── services/           # Serviços de negócio
├── utils/              # Utilitários como envio de e-mails e logger
└── index.ts            # Ponto de entrada do servidor
tests/                  # Testes automatizados
└── <arquivo>.test.ts   # Arquivos que possuirão os testes automatizados
```

## Melhorias Futuras

- Integração com SMS usando Twilio.
- Implementação de push notifications com Firebase Cloud Messaging.
- Implementação de caching para mensagens usando Redis.
