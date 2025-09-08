# 🔌 API Reference - Essenza

Documentação completa da API REST do sistema Essenza.

## 📋 Informações Gerais

- **Base URL**: `http://localhost:3000`
- **Versão**: 1.0.0
- **Formato**: JSON
- **Autenticação**: JWT Bearer Token

## 🔐 Autenticação

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "nome": "João Silva",
    "tipo": "cliente"
  }
}
```

### Registro

```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "nome": "João Silva",
  "tipo": "cliente"
}
```

## 👥 Clientes

### Listar Clientes

```http
GET /clientes
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "telefone": "(11) 99999-9999",
    "dataNascimento": "1990-01-01",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Criar Cliente

```http
POST /clientes
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "(11) 99999-9999",
  "dataNascimento": "1990-01-01",
  "cpf": "123.456.789-00"
}
```

### Atualizar Cliente

```http
PUT /clientes/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva Atualizado",
  "telefone": "(11) 88888-8888"
}
```

### Deletar Cliente

```http
DELETE /clientes/:id
Authorization: Bearer {token}
```

## 👨‍⚕️ Profissionais

### Listar Profissionais

```http
GET /profissional
Authorization: Bearer {token}
```

### Criar Profissional

```http
POST /profissional
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Dr. Maria Santos",
  "email": "maria@exemplo.com",
  "telefone": "(11) 99999-9999",
  "especialidade": "Estética Facial",
  "crn": "12345"
}
```

## 📅 Agendamentos

### Listar Agendamentos

```http
GET /agendamentos
Authorization: Bearer {token}
```

**Parâmetros de Query:**
- `clienteId`: Filtrar por cliente
- `profissionalId`: Filtrar por profissional
- `dataInicio`: Data de início (YYYY-MM-DD)
- `dataFim`: Data de fim (YYYY-MM-DD)

**Resposta:**
```json
[
  {
    "id": 1,
    "title": "Limpeza de Pele",
    "description": "Limpeza facial completa",
    "startDateTime": "2025-01-15T10:00:00.000Z",
    "endDateTime": "2025-01-15T11:00:00.000Z",
    "status": "confirmed",
    "statusPagamento": "pendente",
    "valor": 150.00,
    "cliente": {
      "id": 1,
      "nome": "João Silva"
    },
    "profissional": {
      "id": 1,
      "nome": "Dr. Maria Santos"
    },
    "servico": {
      "id": 1,
      "nome": "Limpeza de Pele"
    }
  }
]
```

### Criar Agendamento

```http
POST /agendamentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Limpeza de Pele",
  "description": "Limpeza facial completa",
  "startDateTime": "2025-01-15T10:00:00.000Z",
  "endDateTime": "2025-01-15T11:00:00.000Z",
  "clienteId": 1,
  "profissionalId": 1,
  "servicoId": 1,
  "valor": 150.00
}
```

### Atualizar Agendamento

```http
PUT /agendamentos/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmed",
  "statusPagamento": "pago"
}
```

### Deletar Agendamento

```http
DELETE /agendamentos/:id
Authorization: Bearer {token}
```

## 🛍️ Serviços

### Listar Serviços

```http
GET /servicos
Authorization: Bearer {token}
```

**Parâmetros de Query:**
- `page`: Página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `search`: Busca por nome

**Resposta:**
```json
{
  "data": [
    {
      "id": 1,
      "nome": "Limpeza de Pele",
      "descricao": "Limpeza facial completa com extração",
      "preco": 150.00,
      "duracao": 60,
      "categoria": "Facial"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Criar Serviço

```http
POST /servicos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Limpeza de Pele",
  "descricao": "Limpeza facial completa com extração",
  "preco": 150.00,
  "duracao": 60,
  "categoria": "Facial"
}
```

## 📦 Produtos

### Listar Produtos

```http
GET /produtos
Authorization: Bearer {token}
```

### Criar Produto

```http
POST /produtos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Creme Hidratante",
  "descricao": "Creme hidratante para peles secas",
  "categoria": "Hidratação",
  "dataValidade": "2025-12-31",
  "baseUnit": "ml"
}
```

## 📊 Estoque

### Saldo do Produto

```http
GET /inventario/produtos/:id/saldo
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "produtoId": 1,
  "saldo": 50.5
}
```

### Extrato do Produto

```http
GET /inventario/produtos/:id/extrato?limit=50
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": 1,
    "quantidade": "10.000",
    "motivo": "entrada_manual",
    "refTipo": "compra",
    "refId": "COMP-001",
    "criadoEm": "2025-01-01T10:00:00.000Z"
  }
]
```

### Criar Movimento de Estoque

```http
POST /inventario/estoque/movimentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "produtoId": 1,
  "quantidade": 10.5,
  "motivo": "entrada_manual",
  "refTipo": "compra",
  "refId": "COMP-001"
}
```

### Executar Serviço (Baixa de Estoque)

```http
POST /inventario/ordens-servico/execucoes
Authorization: Bearer {token}
Content-Type: application/json

{
  "servicoId": 1,
  "quantidade": 1,
  "refTipo": "agendamento",
  "refId": "AGD-001"
}
```

## 📈 Dashboard

### Estatísticas Gerais

```http
GET /dashboard/estatisticas
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "totalClientes": 150,
  "totalProdutos": 45,
  "totalServicos": 12,
  "produtosBaixoEstoque": 3,
  "movimentacoesHoje": 8
}
```

### Produtos com Baixo Estoque

```http
GET /dashboard/produtos-baixo-estoque
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Creme Hidratante",
    "saldo": 5.5,
    "categoria": "Hidratação"
  }
]
```

## 🏥 Fichas de Anamnese

### Criar Ficha

```http
POST /ficha-anamnese
Authorization: Bearer {token}
Content-Type: application/json

{
  "clienteId": 1,
  "healthProblems": "Diabetes tipo 2",
  "medications": "Metformina",
  "allergies": "Penicilina",
  "surgeries": "Apêndice (2010)",
  "lifestyle": "Sedentário"
}
```

### Listar Fichas

```http
GET /ficha-anamnese
Authorization: Bearer {token}
```

### Atualizar Ficha

```http
PUT /ficha-anamnese/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "healthProblems": "Diabetes tipo 2, Hipertensão",
  "medications": "Metformina, Losartana"
}
```

## 📋 Protocolos

### Listar Protocolos

```http
GET /protocolos
Authorization: Bearer {token}
```

### Criar Protocolo

```http
POST /protocolos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Protocolo Anti-idade",
  "descricao": "Tratamento completo anti-idade",
  "observacoes": "Para peles maduras",
  "servicos": [
    {
      "servicoId": 1,
      "ordem": 1,
      "duracaoMin": 30
    },
    {
      "servicoId": 2,
      "ordem": 2,
      "duracaoMin": 45
    }
  ]
}
```

## 🔍 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Sucesso |
| 201 | Created - Criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autorizado |
| 403 | Forbidden - Acesso negado |
| 404 | Not Found - Não encontrado |
| 409 | Conflict - Conflito (ex: email já existe) |
| 422 | Unprocessable Entity - Erro de validação |
| 500 | Internal Server Error - Erro interno |

## 📝 Exemplos de Uso

### Fluxo Completo de Agendamento

```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@exemplo.com","password":"senha123"}'

# 2. Criar agendamento
curl -X POST http://localhost:3000/agendamentos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "title":"Limpeza de Pele",
    "startDateTime":"2025-01-15T10:00:00.000Z",
    "endDateTime":"2025-01-15T11:00:00.000Z",
    "clienteId":1,
    "profissionalId":1,
    "servicoId":1
  }'

# 3. Listar agendamentos
curl -X GET http://localhost:3000/agendamentos \
  -H "Authorization: Bearer {token}"
```

### Gestão de Estoque

```bash
# 1. Verificar saldo
curl -X GET http://localhost:3000/inventario/produtos/1/saldo \
  -H "Authorization: Bearer {token}"

# 2. Adicionar estoque
curl -X POST http://localhost:3000/inventario/estoque/movimentos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "produtoId":1,
    "quantidade":50,
    "motivo":"entrada_manual",
    "refTipo":"compra",
    "refId":"COMP-001"
  }'

# 3. Executar serviço (baixa estoque)
curl -X POST http://localhost:3000/inventario/ordens-servico/execucoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "servicoId":1,
    "quantidade":1,
    "refTipo":"agendamento",
    "refId":"AGD-001"
  }'
```

## 🔒 Segurança

### Headers Obrigatórios

```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### Validação de Dados

Todos os endpoints validam os dados de entrada usando:
- **Class Validator** para validação de tipos
- **Class Transformer** para transformação de dados
- **DTOs** para estrutura de dados

### Rate Limiting

- **Login**: 5 tentativas por minuto por IP
- **API**: 1000 requests por hora por usuário
- **Upload**: 10MB máximo por request

---

**Última atualização**: Janeiro 2025
