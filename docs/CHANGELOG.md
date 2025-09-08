# 📝 Changelog - Essenza

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-01-15

### 🎉 Adicionado
- **Sistema de Agendamentos**
  - Agendamento online para clientes
  - Integração com Google Calendar
  - Confirmação e cancelamento de agendamentos
  - Histórico completo de agendamentos

- **Dashboard Profissional**
  - Estatísticas em tempo real
  - Controle de agenda
  - Alertas de baixo estoque
  - Visão geral das operações

- **Gestão de Clientes**
  - Cadastro completo de clientes
  - Validação de CPF
  - Histórico de tratamentos
  - Fichas de anamnese

- **Gestão de Profissionais**
  - Cadastro de profissionais
  - Controle de especialidades
  - Gestão de horários

- **Controle de Estoque**
  - Cadastro de produtos
  - Movimentações de entrada/saída
  - Alertas de baixo estoque
  - Baixa automática ao executar serviços

- **Catálogo de Serviços**
  - Cadastro de serviços
  - Preços e duração
  - Categorização
  - Associação com produtos (BOM)

- **Protocolos de Tratamento**
  - Criação de protocolos personalizados
  - Sequência de serviços
  - Observações específicas

- **Sistema de Autenticação**
  - Login com JWT
  - Registro de usuários
  - Proteção de rotas
  - Diferentes tipos de usuário

- **Fichas de Anamnese**
  - Histórico médico dos clientes
  - Alergias e medicamentos
  - Cirurgias e problemas de saúde
  - Estilo de vida

### 🔧 Técnico
- **Backend (NestJS 11.0.1)**
  - Arquitetura modular
  - TypeORM para banco de dados
  - Validação com Class Validator
  - CORS configurado
  - Migrações de banco

- **Frontend (Angular 20.1.0)**
  - Componentes reutilizáveis
  - Bootstrap para UI
  - Serviços para API
  - Interceptors para autenticação
  - Roteamento protegido

- **Banco de Dados**
  - MySQL 8.0
  - Charset utf8mb4_unicode_ci
  - Relacionamentos bem definidos
  - Índices para performance

- **Integrações**
  - Google Calendar API
  - JWT para autenticação
  - Validação de CPF

### 📊 Funcionalidades Principais
- ✅ Agendamento online completo
- ✅ Dashboard administrativo
- ✅ Controle de estoque
- ✅ Gestão de clientes e profissionais
- ✅ Protocolos de tratamento
- ✅ Fichas de anamnese
- ✅ Integração Google Calendar
- ✅ Sistema de autenticação seguro

### 🎯 MVP Completo
Esta versão representa o MVP (Minimum Viable Product) completo do sistema Essenza, com todas as funcionalidades essenciais para o funcionamento de uma clínica de estética.

## [0.9.0] - 2025-01-10

### 🚧 Adicionado
- Estrutura inicial do projeto
- Configuração do banco de dados
- Entidades básicas
- Migrações iniciais

### 🔧 Técnico
- Setup do NestJS
- Setup do Angular
- Configuração do TypeORM
- Estrutura de pastas

## [0.8.0] - 2025-01-05

### 🚧 Adicionado
- Planejamento da arquitetura
- Definição dos requisitos
- Estrutura do banco de dados
- Design das interfaces

### 🔧 Técnico
- Documentação inicial
- Definição da stack tecnológica
- Planejamento das funcionalidades

---

## 🔮 Próximas Versões

### [1.1.0] - Planejada para Março 2025
- [ ] Sistema de pagamentos
- [ ] Notificações por email/SMS
- [ ] Relatórios avançados
- [ ] Backup automático
- [ ] Melhorias na UI/UX

### [1.2.0] - Planejada para Junho 2025
- [ ] App mobile (React Native)
- [ ] Integração WhatsApp
- [ ] Sistema de fidelidade
- [ ] Agendamento recorrente
- [ ] Dashboard de analytics

### [2.0.0] - Planejada para Setembro 2025
- [ ] Multi-tenancy
- [ ] API pública
- [ ] Integrações avançadas
- [ ] Machine Learning para recomendações
- [ ] Sistema de avaliações

---

## 📋 Tipos de Mudanças

- **Adicionado** - para novas funcionalidades
- **Alterado** - para mudanças em funcionalidades existentes
- **Depreciado** - para funcionalidades que serão removidas
- **Removido** - para funcionalidades removidas
- **Corrigido** - para correções de bugs
- **Segurança** - para correções de vulnerabilidades

---

**Última atualização**: 15 de Janeiro de 2025
