# Credenciais de Teste

## Usuário Cliente
- **Email:** cliente@teste.com
- **Senha:** 123456

## Backend
- **URL:** http://localhost:3000
- **Status:** ✅ Funcionando

## APIs Testadas
- ✅ POST /auth/register - Registro de usuário
- ✅ POST /auth/login - Login de usuário
- ✅ GET /servico - Lista de serviços

## Como Testar
1. Execute o backend: `cd back_essenza && npm run start:dev`
2. Execute o Flutter: `cd app_essenza && flutter run`
3. Use as credenciais acima para fazer login
4. Teste as funcionalidades do app

## URLs das APIs
- **Serviços:** `/servico` (não `/servicos`)
- **Agendamentos:** `/agendamentos`
- **Auth:** `/auth`
- **Clientes:** `/clientes`
