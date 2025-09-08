# 🚀 Guia de Instalação - Essenza

Este guia fornece instruções detalhadas para instalar e configurar o sistema Essenza em seu ambiente.

## 📋 Pré-requisitos

### Software Necessário

- **Node.js** 18.0.0 ou superior
- **npm** 8.0.0 ou superior
- **MySQL** 8.0 ou superior
- **Git** (para clonagem do repositório)

### Verificação dos Pré-requisitos

```bash
# Verificar Node.js
node --version
# Deve retornar v18.0.0 ou superior

# Verificar npm
npm --version
# Deve retornar 8.0.0 ou superior

# Verificar MySQL
mysql --version
# Deve retornar 8.0 ou superior

# Verificar Git
git --version
# Qualquer versão recente
```

## 🔧 Instalação Passo a Passo

### 1. Clone do Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/essenza.git

# Navegue para o diretório
cd essenza
```

### 2. Configuração do Banco de Dados

#### 2.1. Criar Banco de Dados

```sql
-- Conecte-se ao MySQL como root
mysql -u root -p

-- Crie o banco de dados
CREATE DATABASE essenza CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crie um usuário específico (opcional)
CREATE USER 'essenza_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON essenza.* TO 'essenza_user'@'localhost';
FLUSH PRIVILEGES;

-- Saia do MySQL
EXIT;
```

#### 2.2. Configurar Variáveis de Ambiente

```bash
# Navegue para o diretório do backend
cd back_essenza

# Copie o arquivo de exemplo
cp .env.example .env
```

**Edite o arquivo `.env` com suas configurações:**

```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=sua_senha_mysql
DB_NAME=essenza

# Configurações JWT
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
JWT_EXPIRES_IN=24h

# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações Google Calendar (opcional)
GOOGLE_CLIENT_ID=seu_client_id_google
GOOGLE_CLIENT_SECRET=seu_client_secret_google
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### 3. Instalação do Backend

```bash
# Instale as dependências
npm install

# Execute as migrações do banco
npm run migration:run

# Execute o seed (dados iniciais)
npm run seed

# Inicie o servidor em modo desenvolvimento
npm run start:dev
```

**Verificação**: O backend deve estar rodando em `http://localhost:3000`

### 4. Instalação do Frontend

```bash
# Abra um novo terminal e navegue para o frontend
cd essenza_front

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

**Verificação**: O frontend deve estar rodando em `http://localhost:4200`

## 🔐 Configuração do Google Calendar (Opcional)

### 1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google Calendar
4. Crie credenciais OAuth 2.0

### 2. Configurar Credenciais

1. Vá para "APIs e Serviços" > "Credenciais"
2. Clique em "Criar Credenciais" > "ID do cliente OAuth 2.0"
3. Configure as URLs de redirecionamento:
   - `http://localhost:3000/auth/google/callback`
4. Copie o Client ID e Client Secret

### 3. Atualizar Configurações

```bash
# Edite o arquivo .env no backend
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
```

## 🧪 Verificação da Instalação

### 1. Teste do Backend

```bash
# Teste a API
curl http://localhost:3000

# Teste de saúde
curl http://localhost:3000/health
```

### 2. Teste do Frontend

1. Acesse `http://localhost:4200`
2. Verifique se a página carrega corretamente
3. Teste o cadastro de um novo cliente
4. Teste o login

### 3. Teste de Integração

1. Faça login no sistema
2. Crie um agendamento
3. Verifique se aparece no dashboard do profissional
4. Teste a sincronização com Google Calendar (se configurado)

## 🐛 Solução de Problemas

### Erro de Conexão com Banco

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Soluções:**
1. Verifique se o MySQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Teste a conexão manualmente:
   ```bash
   mysql -u root -p -h localhost
   ```

### Erro de Migração

```
Error: Table doesn't exist
```

**Soluções:**
1. Verifique se o banco foi criado
2. Execute as migrações:
   ```bash
   npm run migration:run
   ```

### Erro de CORS

```
Access to XMLHttpRequest blocked by CORS policy
```

**Soluções:**
1. Verifique se o backend está rodando na porta 3000
2. Verifique se o frontend está rodando na porta 4200
3. Confirme a configuração de CORS no backend

### Erro de Dependências

```
Module not found
```

**Soluções:**
1. Delete `node_modules` e `package-lock.json`
2. Execute `npm install` novamente
3. Verifique a versão do Node.js

## 📦 Scripts Disponíveis

### Backend

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod

# Build
npm run build

# Testes
npm run test
npm run test:e2e

# Banco de dados
npm run migration:gen
npm run migration:run
npm run migration:revert
npm run seed

# Linting
npm run lint
npm run format
```

### Frontend

```bash
# Desenvolvimento
npm start

# Build
npm run build

# Testes
npm test

# Build com SSR
npm run build:ssr
npm run serve:ssr
```

## 🔄 Atualizações

### Atualizar o Sistema

```bash
# Atualizar código
git pull origin main

# Atualizar dependências do backend
cd back_essenza
npm install

# Atualizar dependências do frontend
cd ../essenza_front
npm install

# Executar migrações (se houver)
cd ../back_essenza
npm run migration:run
```

## 📝 Próximos Passos

Após a instalação bem-sucedida:

1. **Configure usuários iniciais**
2. **Cadastre serviços e produtos**
3. **Configure protocolos de tratamento**
4. **Teste o fluxo completo de agendamento**
5. **Configure backup do banco de dados**

## 🆘 Suporte

Se encontrar problemas durante a instalação:

1. Verifique os logs de erro
2. Consulte a seção de troubleshooting
3. Abra uma issue no GitHub
4. Entre em contato com o suporte

---

🧪 Fluxo de Uso e Testes
👩‍💻 Experiência do Cliente

Cadastro

Acessa http://localhost:4200

Cria conta preenchendo dados pessoais + CPF válido

Preenche Ficha de Anamnese obrigatória (histórico de saúde, alergias, etc.)

Autenticação

Faz login com e-mail e senha

Recebe token JWT (gerenciado pelo sistema)

Agendamento de Serviços

Acessa catálogo de serviços

Seleciona profissional, data e horário

Confirma agendamento → aparece em “Meus Agendamentos”

Acompanhamento

Visualiza histórico de agendamentos

Pode reagendar ou cancelar dentro das regras do sistema

Consulta seus protocolos e tratamentos realizados

🧑‍⚕️ Experiência do Profissional

Login no Dashboard

Acessa http://localhost:4200/dashboard-profissional

Autentica com credenciais de profissional

Gestão de Agenda

Visualiza todos os agendamentos (com status e pagamento)

Confirma, altera ou cancela agendamentos

Pode aplicar protocolos em um cliente já cadastrado

Controle de Estoque

Cadastro de novos produtos

Movimentações (entrada/saída)

Sistema gera alertas de baixo estoque (<10 unidades)

Serviços realizados dão baixa automática nos insumos associados

Protocolos e Fichas

Criação e edição de protocolos personalizados

Associação de protocolos a clientes

Consulta da ficha de anamnese antes do atendimento

🔄 Teste de Integração Completo

📌 Para validar todo o fluxo:

Cliente se cadastra e preenche ficha de anamnese

Cliente agenda serviço com profissional disponível

Profissional visualiza agendamento no dashboard

Profissional confirma o agendamento

Ao executar serviço:

Estoque é atualizado automaticamente

Protocolo pode ser vinculado ao tratamento

Ficha de anamnese é consultada antes da execução

Cliente visualiza atualização em histórico de tratamentos

**Última atualização**: Setembro, 2025
