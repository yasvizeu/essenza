# 📋 Implementação da Ficha de Anamnese - Backend

## 📖 Visão Geral

Este documento detalha as modificações realizadas no backend para implementar a funcionalidade de **Ficha de Anamnese** com registro automático de datas de criação e edição.

## 🎯 Objetivos

- ✅ Permitir que clientes tenham fichas de anamnese personalizadas
- ✅ Registrar automaticamente datas de criação e edição
- ✅ Criar endpoints para gerenciar fichas por cliente
- ✅ Popular banco de dados com dados de exemplo

---

## 🔧 Modificações Realizadas

### 1. **Entidade FichaAnamnese** 
**Arquivo:** `src/ficha-anamnese/entities/ficha-anamnese.entity.ts`

#### Modificações:
- Adicionados campos de data automáticos
- Importados decorators do TypeORM para timestamps

#### Código Adicionado:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class FichaAnamnese {
  // ... campos existentes ...

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Funcionalidade:
- **`createdAt`**: Registra automaticamente quando a ficha foi criada
- **`updatedAt`**: Atualiza automaticamente sempre que a ficha for modificada

---

### 2. **DTO de Criação**
**Arquivo:** `src/ficha-anamnese/dto/create-ficha-anamnese.dto.ts`

#### Modificações:
- Adicionados campos opcionais para datas
- Importados validadores de data

#### Código Adicionado:
```typescript
import { IsNotEmpty, IsNumber, IsBoolean, isNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateFichaAnamneseDto {
  // ... campos existentes ...

  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @IsOptional()
  @IsDateString()
  updatedAt?: Date;
}
```

#### Funcionalidade:
- Permite receber datas opcionais na criação
- Valida formato das datas quando fornecidas

---

### 3. **Controller - Novo Endpoint**
**Arquivo:** `src/ficha-anamnese/ficha-anamnese.controller.ts`

#### Modificações:
- Adicionado endpoint para buscar ficha por cliente
- Posicionado antes do endpoint genérico para evitar conflitos

#### Código Adicionado:
```typescript
@Get('cliente/:clienteId')
findByClienteId(@Param('clienteId') clienteId: string) {
  return this.fichaAnamneseService.findByClienteId(+clienteId);
}
```

#### Endpoints Disponíveis:
- `GET /fichas` - Lista todas as fichas
- `GET /fichas/cliente/:clienteId` - **NOVO** - Busca ficha por cliente
- `GET /fichas/:id` - Busca ficha por ID
- `POST /fichas` - Cria nova ficha
- `PATCH /fichas/:id` - Atualiza ficha
- `DELETE /fichas/:id` - Remove ficha

---

### 4. **Service - Novo Método**
**Arquivo:** `src/ficha-anamnese/ficha-anamnese.service.ts`

#### Modificações:
- Adicionado método para buscar ficha por cliente
- Incluído relacionamento com entidade Cliente

#### Código Adicionado:
```typescript
async findByClienteId(clienteId: number) {
  return this.fichaRepo.findOne({
    where: { cliente: { id: clienteId } },
    relations: ['cliente']
  });
}
```

#### Funcionalidade:
- Busca ficha específica de um cliente
- Inclui dados completos do cliente na resposta
- Retorna `null` se não encontrar ficha

---

### 5. **Script de Seed - Dados de Exemplo**
**Arquivo:** `src/database/seed.ts`

#### Modificações:
- Importada entidade FichaAnamnese
- Adicionado repositório para ficha
- Modificado fluxo de criação do cliente
- Adicionado bloco de criação da ficha de anamnese

#### Código Adicionado:
```typescript
import { FichaAnamnese } from '../ficha-anamnese/entities/ficha-anamnese.entity';

// No construtor:
const fichaAnamneseRepository = dataSource.getRepository(FichaAnamnese);

// Modificação na criação do cliente:
let clienteCriado: Cliente | null = null;
if (existingClientes.length === 0) {
  // ... criação do cliente ...
  clienteCriado = await clienteRepository.save(cliente);
} else {
  clienteCriado = existingClientes[0];
}

// Novo bloco de criação da ficha:
if (clienteCriado) {
  const existingFicha = await fichaAnamneseRepository.findOne({
    where: { cliente: { id: clienteCriado.id } }
  });

  if (!existingFicha) {
    console.log('Criando ficha de anamnese para o cliente...');
    const fichaAnamnese = fichaAnamneseRepository.create({
      healthProblems: 'Nenhum problema de saúde conhecido...',
      medications: 'Não utiliza medicamentos contínuos...',
      allergies: 'Alergia a perfumes fortes...',
      surgeries: 'Nenhuma cirurgia realizada...',
      lifestyle: 'Estilo de vida ativo...',
      cliente: clienteCriado
    });
    await fichaAnamneseRepository.save(fichaAnamnese);
    console.log('✅ Ficha de anamnese criada com sucesso!');
  }
}
```

#### Dados de Exemplo Criados:
```json
{
  "healthProblems": "Nenhum problema de saúde conhecido. Pressão arterial normal. Não possui diabetes, hipertensão ou problemas cardíacos.",
  "medications": "Não utiliza medicamentos contínuos. Apenas ocasionalmente paracetamol para dores de cabeça.",
  "allergies": "Alergia a perfumes fortes e produtos com fragrância artificial. Pele sensível a alguns conservantes.",
  "surgeries": "Nenhuma cirurgia realizada. Apenas extração de dente do siso em 2018.",
  "lifestyle": "Estilo de vida ativo. Pratica yoga 3x por semana, caminhada diária. Alimentação balanceada, evita açúcar refinado. Dorme 7-8 horas por noite. Não fuma, bebe socialmente."
}
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `ficha_anamnese`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT PRIMARY KEY | ID único da ficha |
| `healthProblems` | TEXT | Problemas de saúde do cliente |
| `medications` | TEXT | Medicamentos em uso |
| `allergies` | TEXT | Alergias conhecidas |
| `surgeries` | TEXT | Cirurgias realizadas |
| `lifestyle` | TEXT | Estilo de vida do cliente |
| `clienteId` | INT FOREIGN KEY | ID do cliente (relacionamento) |
| `createdAt` | DATETIME | **NOVO** - Data de criação |
| `updatedAt` | DATETIME | **NOVO** - Data da última edição |

### Relacionamentos:
- **1:1** com `cliente` (OneToOne)

---

## 🚀 Como Usar

### 1. **Executar Seed (Dados de Exemplo)**
```bash
cd back_essenza
npm run seed
```

### 2. **Buscar Ficha por Cliente**
```http
GET /fichas/cliente/1
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "id": 1,
  "healthProblems": "Nenhum problema de saúde conhecido...",
  "medications": "Não utiliza medicamentos contínuos...",
  "allergies": "Alergia a perfumes fortes...",
  "surgeries": "Nenhuma cirurgia realizada...",
  "lifestyle": "Estilo de vida ativo...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "cliente": {
    "id": 1,
    "name": "Cliente Teste",
    "email": "cliente@exemplo.com",
    "cpf": "987.654.321-00",
    "birthDate": "1995-05-15",
    "cell": "11987654322",
    "address": "Rua Cliente, 456"
  }
}
```

### 3. **Atualizar Ficha**
```http
PATCH /fichas/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "healthProblems": "Problemas atualizados...",
  "medications": "Medicamentos atualizados..."
}
```

**Nota:** O campo `updatedAt` é atualizado automaticamente pelo TypeORM.

---

## 🔍 Validações

### Campos Obrigatórios:
- ✅ `healthProblems` (string, não vazio)
- ✅ `medications` (string, não vazio)
- ✅ `allergies` (string, não vazio)
- ✅ `surgeries` (string, não vazio)
- ✅ `lifestyle` (string, não vazio)
- ✅ `clienteId` (number, não vazio)

### Campos Opcionais:
- ⚪ `createdAt` (date, formato ISO)
- ⚪ `updatedAt` (date, formato ISO)

---

## 🎯 Benefícios da Implementação

1. **📊 Rastreabilidade**: Todas as edições são registradas com data/hora
2. **🔗 API Completa**: Endpoint específico para buscar ficha por cliente
3. **📝 Dados de Teste**: Cliente demo já possui ficha preenchida
4. **✅ Validação Robusta**: DTOs com validação completa
5. **🔗 Relacionamentos**: Consultas incluem dados completos do cliente
6. **⚡ Automático**: Datas gerenciadas automaticamente pelo TypeORM

---

## 🐛 Troubleshooting

### Erro: "Cliente não encontrado"
- Verifique se o `clienteId` existe na tabela `cliente`
- Confirme se o relacionamento está correto

### Erro: "Ficha não encontrada"
- O cliente pode não ter ficha de anamnese criada
- Use o endpoint de criação para gerar uma nova ficha

### Datas não aparecem
- Verifique se a migração foi executada
- Confirme se os campos `createdAt` e `updatedAt` existem na tabela

---

## 📝 Próximos Passos

1. **Frontend**: Implementar interface para edição da ficha
2. **Validações**: Adicionar validações específicas por tipo de cliente
3. **Histórico**: Implementar log de alterações
4. **Relatórios**: Gerar relatórios baseados nas fichas
5. **Notificações**: Alertar sobre atualizações necessárias

---

**📅 Data de Criação:** Janeiro 2024  
**👨‍💻 Desenvolvedor:** Sistema Essenza  
**🔄 Última Atualização:** Janeiro 2024
