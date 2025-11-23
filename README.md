# 📡 chatConnectBack

Backend moderno e escalável para aplicação de mensagens em tempo real

## 📝 Descrição

**chatConnectBack** é uma API backend robusta, desenvolvida com Express.js e TypeScript, projetada para fornecer toda a base funcional de um sistema moderno de mensagens. A aplicação oferece recursos essenciais como autenticação segura, gerenciamento de usuários, criação de chats privados e em grupo, controle de membros e comunicação em tempo real via Socket.IO.

O uso de TypeScript garante maior segurança, organização e produtividade durante o desenvolvimento, tornando o código mais previsível e escalável.

## ✨ Funcionalidades

- 🔐 **Autenticação JWT** - Sistema seguro de autenticação com tokens
- 👥 **Gerenciamento de usuários** - CRUD completo com validações
- 💬 **Mensagens em tempo real** - Comunicação instantânea via Socket.IO
- 👥➡️👥 **Chats privados e grupos** - Suporte para conversas individuais e em grupo
- 🧩 **Sistema de membros** - Controle de papéis (admin / membro)
- 📦 **Arquitetura em camadas** - Controller → Service → Repository
- 🛡️ **Middleware de autenticação** - Para HTTP e WebSocket
- 🔍 **Paginação cursor-based** - Para listagem eficiente de mensagens
- 🗑️ **Soft delete** - Exclusão lógica de usuários

## 🛠️ Tecnologias Utilizadas

### 🚀 Web Framework

- **Express.js** - Framework web para Node.js

### 📜 Linguagem

- **TypeScript** - Superset tipado do JavaScript

### 📦 Dependências Principais

- `@prisma/client` (v6.19) - ORM para banco de dados
- `bcrypt` - Hash de senhas
- `dotenv` - Gerenciamento de variáveis de ambiente
- `express` - Framework web
- `express-validator` - Validação de dados
- `jsonwebtoken` - Autenticação JWT
- `socket.io` - Comunicação em tempo real

### 🧰 Dependências de Desenvolvimento

- `prisma` (v6.19) - CLI do Prisma
- `ts-node` - Execução de TypeScript
- `tsx` - Executor TypeScript rápido
- `typescript` - Compilador TypeScript
- `eslint` - Linter de código
- `prettier` - Formatador de código

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="mongodb://localhost:27017/chatconnect"
JWT_SECRET="sua_chave_secreta_super_segura_aqui"
PORT=3000
HOST=0.0.0.0
```

### Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Executar migrações (se necessário)
npx prisma migrate dev
```

## ▶️ Como Executar o Projeto

### Modo de Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📚 API REST - Documentação de Rotas

Todas as rotas (exceto `/api/v1/auth/*`) requerem autenticação via header:

```
Authorization: Bearer <token>
```

Base URL: `http://localhost:3000/api/v1`

---

### 🔐 Autenticação (`/api/v1/auth`)

#### `POST /api/v1/auth/register`

Registra um novo usuário.

**Body:**

```json
{
  "email": "usuario@example.com",
  "username": "usuario123",
  "password": "senhaSegura123"
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Usuário cadastrado com sucesso!"
}
```

#### `POST /api/v1/auth/login`

Autentica um usuário e retorna token JWT.

**Body:**

```json
{
  "email": "usuario@example.com",
  "password": "senhaSegura123"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Usuário logado com sucesso!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "email": "usuario@example.com",
      "username": "usuario123"
    }
  }
}
```

#### `GET /api/v1/auth/request-update-password`

Solicita redefinição de senha (envia email com token).

**Body:**

```json
{
  "email": "usuario@example.com"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Email para troca de senha enviado. Verifique sua caixa de entrada."
}
```

---

### 👤 Usuário (`/api/v1/user`)

**Todas as rotas requerem autenticação.**

#### `GET /api/v1/user/me`

Obtém dados do usuário autenticado.

**Response (200):**

```json
{
  "status": "success",
  "message": "Usuário encontrado com sucesso",
  "data": {
    "user": {
      "id": "user_id",
      "email": "usuario@example.com",
      "username": "usuario123"
    }
  }
}
```

#### `GET /api/v1/user/me/request-update-email`

Solicita atualização de email (envia token por email).

**Body:**

```json
{
  "newEmail": "novoemail@example.com"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Email de confirmação enviado. Verifique sua caixa de entrada."
}
```

#### `PATCH /api/v1/user/me/email`

Confirma e atualiza o email do usuário.

**Query:**

```
?token=<jwt_token>
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Email atualizado com sucesso!",
  "user": {
    "id": "user_id",
    "email": "novoemail@example.com",
    "username": "usuario123"
  }
}
```

#### `PATCH /api/v1/user/me/password`

Atualiza a senha do usuário.

**Body:**

```json
{
  "password": "novaSenhaSegura123"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Senha alterada com sucesso"
}
```

#### `PATCH /api/v1/user/me/username`

Atualiza o username do usuário.

**Body:**

```json
{
  "username": "novoUsername"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Nome de usuário alterada com sucesso",
  "data": {
    "user": {
      "id": "user_id",
      "email": "usuario@example.com",
      "username": "novoUsername"
    }
  }
}
```

#### `DELETE /api/v1/user/me`

Remove a conta do usuário (soft delete).

**Response (200):**

```json
{
  "status": "success",
  "message": "Usuário deletado com sucesso"
}
```

---

### 💬 Chat (`/api/v1/chat`)

**Todas as rotas requerem autenticação.**

#### `POST /api/v1/chat/private`

Cria um chat privado entre dois usuários.

**Body:**

```json
{
  "otherUserId": "user_id_do_outro_usuario"
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Chat privado criado com sucesso!",
  "data": {
    "chat": {
      "id": "chat_id",
      "type": "private",
      "createdBy": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "members": [...]
    }
  }
}
```

#### `POST /api/v1/chat/groups`

Cria um chat em grupo.

**Body:**

```json
{
  "title": "Nome do Grupo",
  "members": ["user_id_1", "user_id_2", "user_id_3"]
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Chat criado com sucesso!",
  "data": {
    "chat": {
      "id": "chat_id",
      "type": "group",
      "title": "Nome do Grupo",
      "createdBy": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "members": [...]
    }
  }
}
```

#### `GET /api/v1/chat`

Lista todos os chats do usuário autenticado.

**Response (201):**

```json
{
  "status": "success",
  "message": "Chats encontrados com sucesso!",
  "data": {
    "chats": [...]
  }
}
```

#### `GET /api/v1/chat/:chatId`

Obtém detalhes de um chat específico.

**Response (200):**

```json
{
  "status": "success",
  "message": "Chat encontrado com sucesso",
  "data": {
    "chat": {
      "id": "chat_id",
      "type": "private",
      "members": [...]
    }
  }
}
```

#### `PUT /api/v1/chat/:chatId`

Atualiza um chat (apenas admin). Apenas para grupos.

**Body:**

```json
{
  "title": "Novo Nome do Grupo"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Chat atualizado com sucesso",
  "data": {
    "chat": {...}
  }
}
```

#### `DELETE /api/v1/chat/:chatId`

Deleta um chat (apenas admin).

**Response (200):**

```json
{
  "status": "success",
  "message": "Chat deletado com sucesso"
}
```

---

### 👥 Membros do Chat (`/api/v1/chat/:chatId/members`)

**Todas as rotas requerem autenticação.**

#### `GET /api/v1/chat/:chatId/members`

Lista todos os membros de um chat.

**Response (200):**

```json
{
  "status": "success",
  "message": "Membros encontrados com sucesso",
  "data": {
    "members": [...]
  }
}
```

#### `POST /api/v1/chat/:chatId/members`

Adiciona um novo membro ao chat (apenas admin).

**Body:**

```json
{
  "userId": "user_id_para_adicionar",
  "role": "member"
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Membro adicionado com sucesso",
  "data": {
    "member": {...}
  }
}
```

#### `PATCH /api/v1/chat/:chatId/members/:memberId/role`

Atualiza o papel de um membro (apenas admin).

**Body:**

```json
{
  "newRole": "admin"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Função do membro atualizada com sucesso",
  "data": {
    "member": {...}
  }
}
```

#### `DELETE /api/v1/chat/:chatId/members/:memberId`

Remove um membro do chat (apenas admin).

**Response (204):** No Content

#### `DELETE /api/v1/chat/:chatId/leave`

Usuário sai do chat.

**Response (204):** No Content

---

## 🔌 Socket.IO - Eventos em Tempo Real

### Autenticação

Para conectar via Socket.IO, é necessário enviar o token JWT no handshake:

**Cliente:**

```javascript
const socket = io("http://localhost:3000", {
  auth: {
    token: "seu_jwt_token_aqui",
  },
});
```

Ou via header:

```javascript
const socket = io("http://localhost:3000", {
  extraHeaders: {
    token: "seu_jwt_token_aqui",
  },
});
```

---

### 📨 Eventos de Mensagem

#### `message:send` (Emitir)

Envia uma nova mensagem.

**Payload:**

```json
{
  "chatId": "chat_id",
  "content": "Conteúdo da mensagem"
}
```

**Resposta (`message:sent`):**

```json
{
  "status": "success",
  "message": {
    "id": "message_id",
    "chatId": "chat_id",
    "senderId": "user_id",
    "content": "Conteúdo da mensagem",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "sender": {
      "id": "user_id",
      "username": "usuario123"
    }
  }
}
```

**Broadcast (`message:new`):**
Todos os usuários no chat recebem este evento com a mensagem criada.

#### `message:update` (Emitir)

Atualiza uma mensagem existente.

**Payload:**

```json
{
  "chatId": "chat_id",
  "messageId": "message_id",
  "content": "Novo conteúdo da mensagem"
}
```

**Resposta (`message:update`):**

```json
{
  "status": "success",
  "message": {
    "id": "message_id",
    "content": "Novo conteúdo da mensagem",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    ...
  }
}
```

**Broadcast (`message:updated`):**
Todos os usuários no chat recebem este evento com a mensagem atualizada.

#### `message:delete` (Emitir)

Deleta uma mensagem.

**Payload:**

```json
{
  "chatId": "chat_id",
  "messageId": "message_id"
}
```

**Resposta (`message:deleted`):**

```json
{
  "status": "success",
  "messageId": "message_id"
}
```

**Broadcast (`message:deleted`):**
Todos os usuários no chat recebem este evento com o ID da mensagem deletada.

#### `message:error` (Receber)

Evento de erro para operações de mensagem.

**Payload:**

```json
{
  "message": "Não foi possível enviar a mensagem"
}
```

---

### 💬 Eventos de Chat

#### `chat:join` (Emitir)

Entra em uma sala de chat (room).

**Payload:**

```javascript
socket.emit("chat:join", "chat_id");
```

**Broadcast (`chat:userJoined`):**
Todos os outros usuários no chat recebem:

```json
{
  "userId": "user_id"
}
```

#### `chat:error` (Receber)

Erro ao tentar entrar em um chat.

**Payload:**

```json
{
  "message": "Você não pode entrar neste chat."
}
```

---

### 🔔 Eventos Broadcast (Receber)

Estes eventos são emitidos automaticamente pelo servidor em ações HTTP:

#### `chat:created`

Chat criado (via HTTP).

#### `chat:updated`

Chat atualizado (via HTTP).

#### `chat:deleted`

Chat deletado (via HTTP).

#### `chat:new-member`

Novo membro adicionado ao chat.

#### `chat:added`

Você foi adicionado a um chat.

#### `chat:removed-member`

Membro removido do chat.

#### `chat:role-updated`

Papel de um membro foi atualizado.

#### `chat:your-role-updated`

Seu papel foi atualizado.

#### `chat:leaved`

Usuário saiu do chat.

#### `chat:you-leaved`

Você saiu do chat.

---

## 📁 Estrutura do Projeto

```
.
├── package.json
├── prisma
│   └── schema.prisma
├── prisma.config.ts
├── src
│   ├── app.ts
│   ├── config
│   │   └── prisma.ts
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   ├── chat.controller.ts
│   │   ├── chatMember.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares
│   │   ├── auth.middleware.ts
│   │   └── handlerError.ts
│   ├── repositories
│   │   ├── chat.repository.ts
│   │   ├── chatMember.repository.ts
│   │   ├── message.repository.ts
│   │   └── user.repository.ts
│   ├── routes
│   │   ├── auth.route.ts
│   │   ├── chat.routes.ts
│   │   ├── index.ts
│   │   └── user.route.ts
│   ├── server.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── chat.service.ts
│   │   ├── chatMember.service.ts
│   │   ├── message.service.ts
│   │   └── user.service.ts
│   ├── sockets
│   │   ├── events
│   │   │   ├── chat.event.ts
│   │   │   └── message.event.ts
│   │   ├── index.ts
│   │   └── middleware
│   │       └── authSocket.ts
│   ├── types
│   │   ├── express.d.ts
│   │   ├── message.d.ts
│   │   └── user.d.ts
│   └── utils
│       ├── AppError.ts
│       ├── getAuthenticatedUserId.ts
│       └── removePassword.ts
└── tsconfig.json
```

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas bem definida:

1. **Routes** - Define os endpoints da API
2. **Controllers** - Lida com requisições HTTP e respostas
3. **Services** - Contém a lógica de negócio
4. **Repositories** - Abstrai o acesso ao banco de dados
5. **Sockets** - Gerencia eventos em tempo real

## 🔒 Segurança

- Autenticação JWT para rotas HTTP
- Autenticação JWT para conexões WebSocket
- Hash de senhas com bcrypt (10 rounds)
- Validação de dados com express-validator
- Tratamento centralizado de erros
- Soft delete para preservar dados

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Clone o fork:
   ```bash
   git clone https://github.com/EderH3nr963/chatConnectBack.git
   ```
3. Crie uma branch:
   ```bash
   git checkout -b feature/sua-feature
   ```
4. Faça commits:
   ```bash
   git commit -am "Adiciona nova funcionalidade"
   ```
5. Envie para o fork:
   ```bash
   git push origin feature/sua-feature
   ```
6. Abra um Pull Request

Certifique-se de seguir o estilo do projeto e adicionar testes quando possível.

## 📜 Licença

Este projeto é licenciado sob a **MIT License**.

---

**Desenvolvido com ❤️ usando TypeScript, Express.js e Socket.IO**
