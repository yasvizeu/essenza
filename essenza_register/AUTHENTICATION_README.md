# Sistema de Autenticação JWT - Essenza Register

## Visão Geral

Este projeto implementa um sistema completo de autenticação JWT (JSON Web Token) para o frontend Angular, integrado com o backend NestJS.

## Funcionalidades Implementadas

### 🔐 Autenticação
- **Login/Logout** para clientes e profissionais
- **JWT Token** com refresh automático
- **Proteção de rotas** baseada em autenticação e roles
- **Persistência de sessão** no localStorage

### 🛡️ Segurança
- **Guarda de rotas** (AuthGuard) para verificação de autenticação
- **Guarda de roles** (RoleGuard) para verificação de permissões
- **Interceptor HTTP** para inclusão automática de tokens
- **Refresh automático** de tokens expirados

### 👥 Usuários
- **Clientes**: Acesso ao carrinho e anamnese
- **Profissionais**: Acesso completo ao sistema (estoque, clientes, anamnese)

## Estrutura de Arquivos

```
src/app/
├── models/
│   └── user.model.ts          # Interfaces de usuário e autenticação
├── services/
│   ├── auth.service.ts        # Serviço principal de autenticação
│   └── api.service.ts         # Serviço para comunicação com backend
├── guards/
│   ├── auth.guard.ts          # Guarda para verificação de autenticação
│   └── role.guard.ts          # Guarda para verificação de roles
├── interceptors/
│   └── auth.interceptor.ts    # Interceptor para tokens HTTP
└── components/
    ├── login/                 # Componente de login
    ├── dashboard-profissional/ # Dashboard para profissionais
    └── shared/header/         # Header com informações de usuário
```

## Como Usar

### 1. Login
```typescript
// No componente de login
this.authService.login(credentials).subscribe({
  next: (response) => {
    // Usuário autenticado com sucesso
    console.log('Token:', response.token);
    console.log('Usuário:', response.user);
  },
  error: (error) => {
    // Tratar erro de autenticação
  }
});
```

### 2. Verificar Autenticação
```typescript
// Verificar se está autenticado
if (this.authService.isAuthenticated()) {
  // Usuário está logado
}

// Verificar role
if (this.authService.hasRole('profissional')) {
  // Usuário é profissional
}
```

### 3. Proteger Rotas
```typescript
// No roteamento
{
  path: 'estoque',
  component: Estoque,
  canActivate: [AuthGuard, RoleGuard],
  data: { role: 'profissional' }
}
```

### 4. Logout
```typescript
// Fazer logout
this.authService.logout();
```

## Configuração do Backend

### Endpoints Necessários

#### Autenticação
- `POST /auth/login` - Login de cliente
- `POST /auth/login-profissional` - Login de profissional
- `POST /auth/refresh` - Refresh de token
- `GET /auth/me` - Obter usuário atual

#### Clientes
- `GET /clientes` - Listar clientes
- `POST /clientes` - Criar cliente
- `PUT /clientes/:id` - Atualizar cliente
- `DELETE /clientes/:id` - Deletar cliente

#### Profissionais
- `GET /profissional` - Listar profissionais
- `POST /profissional` - Criar profissional
- `PUT /profissional/:id` - Atualizar profissional
- `DELETE /profissional/:id` - Deletar profissional

#### Produtos
- `GET /produto` - Listar produtos
- `POST /produto` - Criar produto
- `PUT /produto/:id` - Atualizar produto
- `DELETE /produto/:id` - Deletar produto

#### Fichas de Anamnese
- `GET /ficha-anamnese` - Listar fichas
- `POST /ficha-anamnese` - Criar ficha
- `PUT /ficha-anamnese/:id` - Atualizar ficha
- `DELETE /ficha-anamnese/:id` - Deletar ficha

### Estrutura de Resposta de Login
```json
{
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "nome": "Nome do Usuário",
    "tipo": "cliente",
    "cpf": "123.456.789-00"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_example",
  "expiresIn": 3600
}
```

## Variáveis de Ambiente

### Desenvolvimento (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  appName: 'Essenza Register',
  version: '1.0.0'
};
```

### Produção (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.essenza.com.br',
  appName: 'Essenza Register',
  version: '1.0.0'
};
```

## Fluxo de Autenticação

1. **Login**: Usuário insere credenciais
2. **Validação**: Backend valida credenciais
3. **Token**: Backend retorna JWT + refresh token
4. **Armazenamento**: Tokens são salvos no localStorage
5. **Interceptação**: Interceptor adiciona token em todas as requisições
6. **Verificação**: Guardas verificam autenticação e roles
7. **Refresh**: Token é renovado automaticamente quando expira

## Segurança

- **Tokens JWT** com expiração configurável
- **Refresh tokens** para renovação automática
- **Proteção de rotas** baseada em autenticação
- **Verificação de roles** para controle de acesso
- **HTTPS** obrigatório em produção
- **Sanitização** de dados de entrada

## Troubleshooting

### Erro de CORS
- Verificar se o backend está configurado para aceitar requisições do frontend
- Configurar `Access-Control-Allow-Origin` no backend

### Token Expirado
- O sistema renova automaticamente os tokens
- Se houver erro, o usuário é redirecionado para login

### Rotas Protegidas
- Verificar se os guardas estão configurados corretamente
- Confirmar se as roles estão definidas nas rotas

## Próximos Passos

1. **Implementar backend** com NestJS e JWT
2. **Adicionar validação** de formulários
3. **Implementar recuperação** de senha
4. **Adicionar logs** de auditoria
5. **Implementar rate limiting**
6. **Adicionar testes** unitários e e2e

