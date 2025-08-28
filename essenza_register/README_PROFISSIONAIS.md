# Sistema de Login e Registro para Profissionais - Essenza

## Visão Geral

Este sistema implementa um login unificado que permite aos usuários escolher entre fazer login como **Cliente** ou **Profissional**, além de oferecer um sistema de registro específico para profissionais da saúde.

## Funcionalidades Implementadas

### 🔐 Login Unificado
- **Seleção de Tipo de Usuário**: Botões para alternar entre Cliente e Profissional
- **Formulários Separados**: Cada tipo de usuário tem seu próprio formulário de login
- **Validação de Credenciais**: Verificação de email e senha no backend
- **Redirecionamento Inteligente**: Direciona para dashboards específicos após login

### 👨‍⚕️ Registro de Profissionais
- **Formulário Completo**: Todos os campos necessários para profissionais da saúde
- **Validações Específicas**: 
  - Idade mínima de 18 anos
  - CNEC (registro profissional) obrigatório
  - Especialidade obrigatória
- **Indicador de Força de Senha**: Barra visual mostrando a segurança da senha
- **Validação de CPF**: Usa o validador existente do sistema

### 🎨 Interface Moderna
- **Design Responsivo**: Funciona em dispositivos móveis e desktop
- **Animações Suaves**: Transições e efeitos visuais
- **Tema Consistente**: Mantém a identidade visual do Essenza

## Estrutura dos Arquivos

### Frontend (Angular)
```
src/app/components/
├── login/
│   ├── login.ts (componente principal)
│   ├── login.html (template)
│   └── login.scss (estilos)
└── register-profissional/
    ├── register-profissional.ts (componente)
    ├── register-profissional.html (template)
    ├── register-profissional.scss (estilos)
    └── register-profissional-module.ts (módulo)
```

### Backend (NestJS)
```
src/
├── clientes/
│   ├── clientes.controller.ts (endpoint /clientes/login)
│   └── clientes.service.ts (lógica de autenticação)
└── profissional/
    ├── profissional.controller.ts (endpoint /profissional/login)
    └── profissional.service.ts (lógica de autenticação)
```

## Como Usar

### 1. Login
1. Acesse `/login`
2. Escolha entre "Cliente" ou "Profissional"
3. Preencha email e senha
4. Clique em "Entrar"

### 2. Registro de Profissional
1. Acesse `/register-profissional`
2. Preencha todos os campos obrigatórios
3. Clique em "Cadastrar Profissional"
4. Faça login com as credenciais criadas

## Endpoints da API

### Clientes
- `POST /clientes` - Criar novo cliente
- `POST /clientes/login` - Login de cliente
- `GET /clientes` - Listar todos os clientes
- `GET /clientes/:id` - Buscar cliente por ID

### Profissionais
- `POST /profissional` - Criar novo profissional
- `POST /profissional/login` - Login de profissional
- `GET /profissional` - Listar todos os profissionais
- `GET /profissional/:id` - Buscar profissional por ID

## Campos do Profissional

| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| name | string | ✅ | 10-60 caracteres, apenas letras |
| birthDate | date | ✅ | Idade entre 18-120 anos |
| cpf | string | ✅ | CPF válido |
| email | string | ✅ | Email válido |
| cell | string | ✅ | 10-11 dígitos |
| address | string | ✅ | - |
| especialidade | string | ✅ | 3-100 caracteres |
| cnec | number | ✅ | 6-8 dígitos |
| password | string | ✅ | Mínimo 6 caracteres, complexa |

## Segurança

⚠️ **Importante**: O sistema atual usa comparação direta de senhas. Para produção, implemente:

1. **Hash de Senhas**: Use bcrypt ou similar
2. **JWT Tokens**: Implemente autenticação baseada em tokens
3. **Rate Limiting**: Limite tentativas de login
4. **Validação de Entrada**: Sanitize todos os inputs

## Próximos Passos

1. **Implementar JWT**: Sistema de tokens para sessões
2. **Dashboard de Profissional**: Interface específica para profissionais
3. **Gestão de Agendamentos**: Sistema de consultas
4. **Perfil do Usuário**: Edição de dados pessoais
5. **Recuperação de Senha**: Sistema de reset de senha

## Tecnologias Utilizadas

- **Frontend**: Angular 17, Bootstrap 5, SCSS
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Validação**: Validators customizados, Reactive Forms
- **Estilização**: CSS moderno com animações e responsividade

## Suporte

Para dúvidas ou problemas, consulte a documentação do NestJS e Angular, ou entre em contato com a equipe de desenvolvimento.
