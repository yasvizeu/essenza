📚 Essenza

Bem-vindo(a) à documentação do Essenza, um sistema de gestão inteligente para clínicas de estética e beleza.
Aqui você encontrará informações sobre funcionalidades, arquitetura, uso, instalação e boas práticas de desenvolvimento.

📖 Índice

- Visão Geral
- Arquitetura do Sistema
- Instalação e Configuração
- Guia do Usuário
- API Reference
- Desenvolvimento
- Deploy
- Troubleshooting
- Contribuição
- Licença



🎯 Visão Geral

O Essenza é um sistema completo que ajuda clínicas de estética a:

✅ Organizar cadastros de clientes e profissionais
✅ Gerenciar agendamentos e fichas de anamnese digitais
✅ Controlar estoque e protocolos de tratamento
✅ Visualizar estatísticas e relatórios em dashboards
✅ Reduzir burocracias → mais tempo livre, mais lucro

🔒 Foco em segurança, boas práticas de desenvolvimento e experiência do usuário.


🏗️ Arquitetura do Sistema
🔧 Stack Tecnológica
Frontend  → Angular 20 + Bootstrap
Backend   → NestJS 11 + TypeORM + JWT
Database  → MySQL 8
Services  → Microserviço Spring Boot (envio de e-mails)
Integrations → Google Calendar API


🔎 Diagrama Simplificado
[ Angular Front ] ←→ [ NestJS API ] ←→ [ MySQL ]
                          ↓
                 [ Spring Boot Service ]
                          ↓
                [ E-mails / Notificações ]


📦 Estrutura de Módulos

- Backend (NestJS)

- Auth → Login, registro e JWT

- Clientes → Cadastro, atualização e consulta

- Profissionais → Gestão da equipe

- Agendamentos → Sistema completo de agendamento

- Fichas Anamnese → Histórico clínico digital

- Estoque → Produtos e movimentações

- Protocolos → Protocolos de tratamento personalizados

- Dashboard → Estatísticas e relatórios

- Frontend (Angular)

- Home (landing page)

- Registro/Login

- Área do Cliente (perfil, agendamentos)

- Dashboard Profissional (agenda, estoque, relatórios)

- Formulários interativos com validações


🚀 Instalação e Configuração
🔑 Pré-requisitos

- Node.js ≥ 18

- npm ≥ 8

- MySQL ≥ 8

- Angular CLI ≥ 17

- Git

- (Opcional) Docker

⚙️ Passo a Passo
# 1. Clone o repositório
git clone https://github.com/seu-usuario/essenza.git
cd essenza

# 2. Configure o banco
# Crie um schema MySQL "essenza" e ajuste o .env

# 3. Backend (NestJS)
cd back_essenza
npm install
npm run start:dev

# 4. Frontend (Angular)
cd front_essenza
npm install
ng serve -o


📌 Dica: variáveis de ambiente devem ser configuradas em um arquivo .env no backend:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=senha
DB_NAME=essenza
JWT_SECRET=essenza_secret

👥 Guia do Usuário

Para Clientes

- Cadastro → Preencha nome, CPF, e-mail, senha e ficha de anamnese.
- Agendamento → Escolha serviço, data e horário disponíveis.
- Gerenciamento → Consulte, reagende ou cancele seus atendimentos.

Para Profissionais

- Dashboard → Acesse visão geral da clínica.
- Agenda → Veja atendimentos, confirme ou recuse.
- Estoque → Cadastre e controle produtos usados em protocolos.
- Protocolos → Crie protocolos personalizados para clientes.

🔌 API Reference
Clientes
POST   /clientes         # Cria cliente
GET    /clientes         # Lista clientes
GET    /clientes/:id     # Busca cliente
PUT    /clientes/:id     # Atualiza cliente
DELETE /clientes/:id     # Remove cliente

Agendamentos
POST   /agendamentos
GET    /agendamentos
PUT    /agendamentos/:id
DELETE /agendamentos/:id

Autenticação
POST /auth/login
POST /auth/register



📌 Veja a coleção Postman em: /docs/Essenza_API.postman_collection.json

💻 Desenvolvimento
Padrões de Código

Backend:

- NestJS + TypeORM
- DTOs e Validadores (class-validator)
- Guards para roles
- Interceptors para responses

Frontend:

- Angular com Reactive Forms
- Serviços para lógica de negócio
- Guards para proteção de rotas
- Pipes para formatações

Testes
# Backend
npm run test         # unitários
npm run test:e2e     # end-to-end

# Frontend
npm test
npm run e2e

🚀 Deploy
Produção (manual)
# Backend
npm run build
npm run start:prod

# Frontend
ng build --configuration production

Docker (opcional)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]

🔧 Troubleshooting
Problema	Solução
ECONNREFUSED 127.0.0.1:3306	MySQL não está rodando. Verifique serviço e credenciais.
CORS policy error	Configure app.enableCors() no NestJS.
Unauthorized (401)	Token JWT ausente ou inválido.
Error: Table doesn't exist	Execute as migrações com npm run typeorm migration:run.
🤝 Contribuição

- Faça um fork

- Crie uma branch feature/minha-feature

- Commit suas mudanças

- Abra um Pull Request 🚀

📄 Licença

Este projeto está sob a licença MIT.
Sinta-se livre para usar, modificar e contribuir.

✨ Última atualização: Setembro 2025

📌 Versão da documentação: 1.1.0



