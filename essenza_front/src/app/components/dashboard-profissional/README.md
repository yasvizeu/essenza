# Dashboard Profissional - Essenza

## 📋 Visão Geral

O Dashboard Profissional é uma interface completa e moderna para profissionais de estética gerenciarem todos os aspectos da clínica. Desenvolvido com Angular 20 e Bootstrap, oferece uma experiência de usuário intuitiva e responsiva.

## 🎯 Funcionalidades Principais

### 📊 **Dashboard Principal**
- **Estatísticas em Tempo Real**: Visualização de totais de clientes, produtos, serviços e alertas
- **Cards Informativos**: Métricas importantes como produtos com baixo estoque e movimentações do dia
- **Interface Responsiva**: Adaptável a diferentes tamanhos de tela

### 📦 **Gestão de Estoque**
- **Visualização de Produtos**: Lista completa com filtros e busca
- **Controle de Quantidades**: Monitoramento de saldo em tempo real
- **Alertas de Baixo Estoque**: Notificações automáticas para produtos com estoque baixo
- **Movimentações**: Histórico completo de entradas e saídas
- **Movimentação Manual**: Interface para registrar entradas/saídas de estoque

### 👥 **Gestão de Clientes**
- **Lista de Clientes**: Visualização completa dos clientes cadastrados
- **Busca Avançada**: Filtros por nome, email ou CPF
- **Informações Detalhadas**: Dados pessoais e de contato
- **Modal de Busca**: Interface dedicada para encontrar clientes específicos

### 👨‍⚕️ **Gestão de Profissionais**
- **Cadastro de Novos Profissionais**: Formulário completo com validações
- **Lista de Equipe**: Visualização de todos os profissionais
- **Perfis Detalhados**: Informações profissionais e de contato
- **Controle de Acesso**: Diferenciação entre administradores e profissionais

### ✂️ **Execução de Serviços**
- **Catálogo de Serviços**: Lista completa com preços e descrições
- **Execução Automática**: Baixa automática no estoque ao executar serviços
- **Controle de Quantidade**: Execução de múltiplas unidades
- **Rastreamento**: Referências para auditoria

### 📈 **Relatórios e Movimentações**
- **Histórico de Movimentações**: Últimas operações de estoque
- **Filtros por Período**: Visualização por data/hora
- **Detalhes de Produtos**: Saldo atual e movimentações específicas
- **Relatórios em Tempo Real**: Dados sempre atualizados

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **Angular 20**: Framework principal com TypeScript
- **Bootstrap 5**: Framework CSS para design responsivo
- **Bootstrap Icons**: Ícones modernos e consistentes
- **Reactive Forms**: Formulários reativos com validação
- **RxJS**: Programação reativa para operações assíncronas

### **Backend**
- **NestJS**: Framework Node.js com TypeScript
- **TypeORM**: ORM para banco de dados
- **MySQL**: Banco de dados relacional
- **JWT**: Autenticação segura
- **Passport**: Estratégias de autenticação

## 🚀 Como Usar

### **1. Login como Profissional**
- Acesse a página de login
- Selecione "Profissional" como tipo de usuário
- Use as credenciais fornecidas no seed do banco:
  - Email: `admin@exemplo.com`
  - Senha: `Admin123@`

### **2. Navegação no Dashboard**
- **Tabs Principais**: Estoque, Serviços, Clientes, Profissionais, Movimentações
- **Ações Rápidas**: Botões para operações frequentes
- **Busca**: Filtros em tempo real para encontrar informações

### **3. Operações Principais**

#### **Movimentar Estoque**
1. Clique em "Movimentar Estoque" nas ações rápidas
2. Selecione o produto
3. Digite a quantidade (positiva para entrada, negativa para saída)
4. Escolha o motivo da movimentação
5. Confirme a operação

#### **Cadastrar Novo Profissional**
1. Clique em "Novo Profissional" nas ações rápidas
2. Preencha todos os campos obrigatórios
3. Defina especialidade e CRM se aplicável
4. Marque como administrador se necessário
5. Confirme o cadastro

#### **Buscar Clientes**
1. Clique em "Buscar Clientes" nas ações rápidas
2. Digite nome, email ou CPF
3. Visualize os resultados filtrados
4. Acesse informações detalhadas

#### **Executar Serviço**
1. Vá para a aba "Serviços"
2. Clique em "Executar" no serviço desejado
3. Defina a quantidade de execuções
4. Adicione referências se necessário
5. Confirme a execução

## 📱 Responsividade

O dashboard é totalmente responsivo e funciona em:
- **Desktop**: Interface completa com todas as funcionalidades
- **Tablet**: Layout adaptado com navegação otimizada
- **Mobile**: Interface simplificada mantendo funcionalidades essenciais

## 🔒 Segurança

- **Autenticação JWT**: Tokens seguros com expiração
- **Guards de Rota**: Proteção de páginas restritas
- **Validação de Dados**: Verificação de entrada em formulários
- **Controle de Acesso**: Diferenciação de permissões por tipo de usuário

## 🎨 Design System

### **Cores Principais**
- **Verde**: `#198754` (sucesso, ações positivas)
- **Azul**: `#0d6efd` (informação, links)
- **Amarelo**: `#ffc107` (aviso, atenção)
- **Vermelho**: `#dc3545` (erro, baixo estoque)

### **Componentes**
- **Cards**: Sombras suaves e bordas arredondadas
- **Botões**: Hover effects e estados visuais
- **Tabelas**: Linhas alternadas e hover effects
- **Modais**: Backdrop e animações suaves

## 🔧 Configuração

### **Variáveis de Ambiente**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=sua_senha
DB_NAME=essenza
JWT_SECRET=seu_jwt_secret
JWT_REFRESH_SECRET=seu_refresh_secret
```

### **Instalação**
```bash
# Frontend
cd essenza_front
npm install
ng serve

# Backend
cd back_essenza
npm install
npm run start:dev
```

## 📊 Estrutura de Dados

### **Produtos**
- Nome, descrição, categoria
- Quantidade em estoque
- Unidade de medida
- Data de validade

### **Serviços**
- Nome e descrição
- Preço
- Relacionamento com produtos (BOM)

### **Clientes**
- Dados pessoais completos
- Ficha de anamnese
- Histórico de atendimentos

### **Profissionais**
- Informações profissionais
- Especialidades
- Controle de acesso

## 🚀 Próximas Funcionalidades

- [ ] Sistema de agendamento
- [ ] Relatórios avançados
- [ ] Notificações push
- [ ] Integração com pagamentos
- [ ] Dashboard de métricas avançadas
- [ ] Sistema de backup automático

## 📞 Suporte

Para dúvidas ou sugestões sobre o Dashboard Profissional, entre em contato com a equipe de desenvolvimento.
