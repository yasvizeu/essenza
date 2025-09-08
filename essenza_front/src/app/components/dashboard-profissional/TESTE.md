# 🚀 Como Testar o Dashboard Profissional

## 📋 Pré-requisitos

1. **Backend rodando**: Certifique-se de que o servidor NestJS está executando na porta 3000
2. **Frontend rodando**: Certifique-se de que o Angular está executando na porta 4200
3. **Banco de dados**: MySQL configurado e populado com dados de teste

## 🔧 Configuração Inicial

### 1. **Configurar Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto `back_essenza`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=sua_senha_aqui
DB_NAME=essenza
JWT_SECRET=seu_jwt_secret_aqui
JWT_REFRESH_SECRET=seu_refresh_secret_aqui
```

### 2. **Executar Migrações e Seed**
```bash
cd back_essenza

# Executar migrações
npm run migration:run

# Executar seed para criar dados de teste
npm run seed
```

### 3. **Iniciar Servidores**
```bash
# Terminal 1 - Backend
cd back_essenza
npm run start:dev

# Terminal 2 - Frontend
cd essenza_front
ng serve
```

## 👤 Credenciais de Teste

Após executar o seed, você terá acesso aos seguintes usuários:

### **Profissional Administrador**
- **Email**: `admin@exemplo.com`
- **Senha**: `Admin123@`
- **Tipo**: Profissional
- **Admin**: Sim

### **Cliente Teste**
- **Email**: `cliente@exemplo.com`
- **Senha**: `Cliente123@`
- **Tipo**: Cliente

## 🧪 Testes das Funcionalidades

### **1. Login e Acesso**
1. Acesse `http://localhost:4200/login`
2. Selecione "Profissional" como tipo de usuário
3. Use as credenciais do profissional administrador
4. Verifique se é redirecionado para `/dashboard-profissional`

### **2. Dashboard Principal**
- [ ] Verificar se as estatísticas são exibidas corretamente
- [ ] Confirmar que os cards mostram dados reais
- [ ] Testar a responsividade em diferentes tamanhos de tela

### **3. Gestão de Estoque**
- [ ] **Visualizar Produtos**: Verificar se a lista de produtos é exibida
- [ ] **Filtros**: Testar busca por nome e categoria
- [ ] **Alertas**: Verificar se produtos com baixo estoque são destacados
- [ ] **Movimentação Manual**:
  1. Clicar em "Movimentar Estoque"
  2. Selecionar um produto
  3. Inserir quantidade (positiva ou negativa)
  4. Escolher motivo
  5. Confirmar operação
  6. Verificar se o saldo foi atualizado

### **4. Cadastro de Profissionais**
- [ ] **Novo Profissional**:
  1. Clicar em "Novo Profissional"
  2. Preencher formulário com dados válidos
  3. Testar validações (campos obrigatórios, email válido)
  4. Confirmar cadastro
  5. Verificar se aparece na lista de profissionais

### **5. Busca de Clientes**
- [ ] **Modal de Busca**:
  1. Clicar em "Buscar Clientes"
  2. Testar busca por nome
  3. Testar busca por email
  4. Testar busca por CPF
  5. Verificar se os resultados são filtrados corretamente

### **6. Execução de Serviços**
- [ ] **Executar Serviço**:
  1. Ir para aba "Serviços"
  2. Clicar em "Executar" em um serviço
  3. Definir quantidade
  4. Adicionar referências opcionais
  5. Confirmar execução
  6. Verificar se houve baixa automática no estoque

### **7. Navegação e Tabs**
- [ ] Testar navegação entre todas as abas
- [ ] Verificar se os dados são carregados corretamente em cada aba
- [ ] Testar responsividade das tabs em mobile

## 🐛 Problemas Comuns e Soluções

### **Erro de Conexão com Backend**
```
Error: Http failure response for http://localhost:3000/...
```
**Solução**: Verificar se o backend está rodando na porta 3000

### **Erro de Autenticação**
```
401 Unauthorized
```
**Solução**: Verificar se o JWT_SECRET está configurado corretamente

### **Erro de Banco de Dados**
```
Connection refused
```
**Solução**: Verificar configurações do MySQL e se o banco existe

### **Dados não aparecem**
```
Array vazio ou undefined
```
**Solução**: Executar o seed novamente para popular dados de teste

## 📊 Dados de Teste Criados pelo Seed

### **Produtos**
- Óleo de Argan (500ml)
- Máscara de Argila (200g)
- Sérum Vitamina C (100ml)
- Protetor Solar FPS 50 (150ml)
- Hidratante Facial (80ml)

### **Serviços**
- Limpeza de Pele Profunda (R$ 120,00)
- Tratamento Anti-idade (R$ 180,00)
- Hidratação Intensiva (R$ 95,00)
- Peeling Químico (R$ 250,00)
- Tratamento para Acne (R$ 150,00)

### **Relacionamentos Serviço-Produto**
- Limpeza de Pele usa Máscara de Argila e Sérum Vitamina C
- Tratamento Anti-idade usa Sérum Vitamina C e Hidratante Facial
- Hidratação Intensiva usa Óleo de Argan

## 🔍 Verificações de Qualidade

### **Performance**
- [ ] Carregamento inicial em menos de 3 segundos
- [ ] Transições suaves entre abas
- [ ] Modais abrem/fecham sem travamentos

### **Usabilidade**
- [ ] Interface intuitiva e fácil de navegar
- [ ] Botões e links funcionais
- [ ] Formulários com validação adequada
- [ ] Mensagens de erro claras

### **Responsividade**
- [ ] Funciona em desktop (1920x1080)
- [ ] Funciona em tablet (768px)
- [ ] Funciona em mobile (375px)

### **Segurança**
- [ ] Rotas protegidas por autenticação
- [ ] Tokens JWT válidos
- [ ] Validação de dados no frontend e backend

## 📝 Checklist Completo

### **Funcionalidades Básicas**
- [ ] Login como profissional
- [ ] Redirecionamento para dashboard
- [ ] Logout funcional
- [ ] Proteção de rotas

### **Dashboard**
- [ ] Estatísticas carregam corretamente
- [ ] Cards mostram dados reais
- [ ] Ações rápidas funcionais
- [ ] Responsividade

### **Estoque**
- [ ] Lista de produtos
- [ ] Filtros funcionais
- [ ] Movimentação manual
- [ ] Alertas de baixo estoque
- [ ] Histórico de movimentações

### **Clientes**
- [ ] Lista de clientes
- [ ] Busca avançada
- [ ] Modal de busca
- [ ] Informações detalhadas

### **Profissionais**
- [ ] Lista de profissionais
- [ ] Cadastro de novo profissional
- [ ] Validações de formulário
- [ ] Diferenciação admin/profissional

### **Serviços**
- [ ] Lista de serviços
- [ ] Execução de serviços
- [ ] Baixa automática no estoque
- [ ] Referências opcionais

## 🎯 Próximos Passos

Após testar todas as funcionalidades:

1. **Implementar sistema de agendamento**
2. **Adicionar relatórios avançados**
3. **Criar dashboard para clientes**
4. **Implementar notificações**
5. **Adicionar sistema de pagamentos**

## 📞 Suporte

Se encontrar problemas durante os testes:

1. Verificar logs do console do navegador
2. Verificar logs do servidor NestJS
3. Verificar conexão com banco de dados
4. Consultar a documentação do projeto
5. Entrar em contato com a equipe de desenvolvimento
