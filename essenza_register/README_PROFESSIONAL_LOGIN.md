# Funcionalidades de Login e Registro de Profissional - Essenza

## Visão Geral

Este documento descreve as funcionalidades implementadas para registro de profissionais e sistema de login unificado no projeto Essenza.

## Funcionalidades Implementadas

### 1. Registro de Profissional

**Arquivo:** `src/app/components/professional-register/`

- **Componente TypeScript:** `professional-register.ts`
- **Template HTML:** `professional-register.html`
- **Estilos SCSS:** `professional-register.scss`
- **Módulo:** `professional-register-module.ts`

#### Campos do Formulário:
- Nome Completo (10-60 caracteres, apenas letras)
- Data de Nascimento (mínimo 18 anos)
- CPF (validação personalizada)
- E-mail (formato válido)
- Celular (10-11 dígitos)
- Endereço
- Especialidade (3-50 caracteres)
- CNEC - Conselho Regional (apenas números)
- Senha (com validação de força)
- Confirmação de senha

#### Validações:
- Validação de CPF personalizada
- Validação de idade mínima (18 anos)
- Validação de força de senha
- Confirmação de senha
- Validação de formato de e-mail
- Validação de telefone

### 2. Sistema de Login Unificado

**Arquivo:** `src/app/components/login/`

#### Funcionalidades:
- Toggle para alternar entre login de Cliente e Profissional
- Validação de credenciais
- Integração com backend
- Armazenamento de dados de sessão no localStorage
- Redirecionamento baseado no tipo de usuário

#### Melhorias Implementadas:
- Interface visual para seleção do tipo de usuário
- Links para registro de cliente e profissional
- Integração com serviço de autenticação
- Tratamento de erros

### 3. Backend - Autenticação

**Arquivos modificados:**
- `back_essenza - Copia/src/personas/personas.service.ts`
- `back_essenza - Copia/src/personas/personas.controller.ts`
- `back_essenza - Copia/src/personas/personas.module.ts`

#### Endpoint de Login:
- **POST** `/personas/login`
- **Body:** `{ email: string, senha: string }`
- **Response:** `{ success: boolean, user: object, type: string }`

#### Funcionalidades:
- Busca de usuário por e-mail
- Verificação de senha
- Identificação automática do tipo de usuário (cliente/profissional)
- Retorno de dados do usuário autenticado

### 4. Serviços Frontend

**Arquivo:** `src/app/services/essenza.service.ts`

#### Novos Métodos:
- `createProfessional(professionalData)` - Cria novo profissional
- `getProfissionais()` - Lista todos os profissionais
- `getProfissionalById(id)` - Busca profissional por ID
- `updateProfissional(id, data)` - Atualiza profissional
- `deleteProfissional(id)` - Remove profissional
- `login(loginData)` - Autenticação de usuário

## Rotas Implementadas

### Frontend (Angular)
- `/professional-register` - Página de registro de profissional
- `/login` - Página de login (atualizada)

### Backend (NestJS)
- `POST /profissionais` - Criar profissional
- `GET /profissionais` - Listar profissionais
- `GET /profissionais/:id` - Buscar profissional por ID
- `PATCH /profissionais/:id` - Atualizar profissional
- `DELETE /profissionais/:id` - Remover profissional
- `POST /personas/login` - Autenticação

## Design e UX

### Características do Design:
- **Glassmorphism:** Efeito de vidro translúcido
- **Responsivo:** Adaptável a diferentes tamanhos de tela
- **Consistente:** Segue o padrão visual do projeto
- **Acessível:** Labels, placeholders e feedback visual

### Elementos Visuais:
- Fundo com imagem de folhas
- Cartão com efeito blur
- Campos com validação visual
- Barra de força de senha
- Botões com hover effects
- Ícones do Bootstrap Icons

## Integração com Backend

### Estrutura de Dados - Profissional:
```typescript
{
  name: string;
  birthDate: string;
  cpf: string;
  email: string;
  password: string;
  cell: string;
  address: string;
  especialidade: string;
  cnec: number;
  admin: boolean;
  type: 'profissional';
}
```

### Estrutura de Dados - Login:
```typescript
{
  email: string;
  senha: string;
}
```

## Segurança

### Implementado:
- Validação de dados no frontend
- Validação de dados no backend
- Validação de CPF
- Validação de força de senha
- Confirmação de senha

### Recomendações para Produção:
- Implementar hash de senhas (bcrypt)
- Implementar JWT tokens
- Implementar refresh tokens
- Implementar rate limiting
- Implementar HTTPS
- Implementar validação de entrada mais rigorosa

## Como Usar

### 1. Registro de Profissional:
1. Acesse `/professional-register`
2. Preencha todos os campos obrigatórios
3. Clique em "Cadastrar Profissional"
4. Aguarde confirmação e redirecionamento

### 2. Login:
1. Acesse `/login`
2. Selecione o tipo de usuário (Cliente/Profissional)
3. Digite e-mail e senha
4. Clique em "Entrar"
5. Aguarde autenticação e redirecionamento

## Próximos Passos

1. **Implementar JWT Authentication**
2. **Criar páginas específicas para profissionais**
3. **Implementar recuperação de senha**
4. **Adicionar validação de CNEC**
5. **Implementar upload de documentos**
6. **Criar dashboard de profissional**
7. **Implementar sistema de agendamento**

## Tecnologias Utilizadas

- **Frontend:** Angular 17, TypeScript, SCSS, Bootstrap
- **Backend:** NestJS, TypeORM, MySQL
- **Validação:** Angular Reactive Forms, class-validator
- **Estilização:** Glassmorphism, CSS Grid, Flexbox
