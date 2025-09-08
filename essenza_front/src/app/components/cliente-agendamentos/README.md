# Sistema de Agendamentos - Essenza

## Visão Geral

O sistema de agendamentos do Essenza é uma solução completa para gerenciamento de agendamentos de clientes em clínicas de estética, integrada com o Google Calendar API para sincronização automática e gestão profissional.

## Funcionalidades Implementadas

### 🗓️ Gestão de Agendamentos
- **Visualização de agendamentos**: Lista completa dos agendamentos do cliente
- **Filtros avançados**: Por status (confirmado, pendente, cancelado) e período (hoje, semana, mês)
- **Ações em tempo real**: Confirmar, cancelar e reagendar agendamentos
- **Estados visuais**: Indicadores para agendamentos de hoje, amanhã e próximos

### 📱 Interface do Cliente
- **Dashboard personalizado**: Visualização clara dos próximos agendamentos
- **Estado vazio inteligente**: Quando não há agendamentos, mostra serviços disponíveis
- **Navegação intuitiva**: Links diretos na navbar para "Meus Agendamentos"
- **Responsividade completa**: Funciona perfeitamente em todos os dispositivos

### 🔄 Integração Google Calendar
- **Sincronização automática**: Agendamentos sincronizados com Google Calendar
- **CRUD completo**: Criar, ler, atualizar e deletar eventos
- **Autenticação OAuth**: Integração segura com contas Google
- **Backup automático**: Todos os agendamentos salvos na nuvem

## Estrutura de Arquivos

```
agendamentos/
├── services/
│   └── agendamentos.ts          # Serviço principal de agendamentos
├── components/
│   └── cliente-agendamentos/
│       ├── cliente-agendamentos.ts    # Lógica do componente
│       ├── cliente-agendamentos.html  # Template HTML
│       ├── cliente-agendamentos.scss  # Estilos personalizados
│       └── README.md                  # Documentação
└── routes/
    └── app.routes.ts            # Rotas atualizadas
```

## Integração com Google Calendar API

### Configuração Necessária

1. **Google Cloud Console**:
   - Criar projeto no Google Cloud Console
   - Habilitar Google Calendar API
   - Configurar OAuth 2.0 credentials
   - Definir redirect URIs

2. **Backend (NestJS)**:
   ```typescript
   // Exemplo de configuração
   @Injectable()
   export class GoogleCalendarService {
     private readonly calendar = google.calendar('v3');
     
     async createEvent(eventData: Agendamento) {
       // Implementação da criação de evento
     }
   }
   ```

3. **Frontend (Angular)**:
   ```typescript
   // Serviço já implementado
   export class AgendamentosService {
     // Métodos para integração com Google Calendar
     autenticarGoogleCalendar(): Observable<any>
     sincronizarComGoogleCalendar(): Observable<any>
     criarEventoGoogleCalendar(): Observable<any>
   }
   ```

## Fluxo de Funcionamento

### 1. Cliente Acessa Agendamentos
- Cliente logado clica em "Meus Agendamentos" na navbar
- Sistema verifica autenticação e carrega agendamentos
- Se não há agendamentos, mostra serviços disponíveis

### 2. Visualização de Agendamentos
- Lista ordenada por data (mais próximos primeiro)
- Filtros por status e período
- Ações contextuais (confirmar, cancelar, reagendar)

### 3. Sincronização com Google Calendar
- Agendamentos criados são automaticamente sincronizados
- Profissionais podem ver agenda no Google Calendar
- Notificações automáticas do Google

## Estados da Interface

### Loading
- Spinner durante carregamento
- Mensagens de feedback

### Empty State
- Ícone e mensagem quando não há agendamentos
- Cards de serviços disponíveis para agendamento
- Call-to-action para primeiro agendamento

### Error State
- Mensagens de erro amigáveis
- Botão para tentar novamente
- Fallback para serviços

## Funcionalidades do Serviço

### Métodos Principais
```typescript
// CRUD de agendamentos
criarAgendamento(agendamento: NovoAgendamento): Observable<Agendamento>
getAgendamentosCliente(clienteId: number): Observable<Agendamento[]>
atualizarAgendamento(id: string, agendamento: Partial<Agendamento>): Observable<Agendamento>
cancelarAgendamento(id: string, motivo?: string): Observable<Agendamento>

// Google Calendar
autenticarGoogleCalendar(): Observable<any>
sincronizarComGoogleCalendar(profissionalId: number): Observable<any>
criarEventoGoogleCalendar(agendamento: Agendamento): Observable<any>

// Utilitários
formatarData(data: string): string
formatarHorario(data: string): string
isHoje(data: string): boolean
isProximo(data: string): boolean
```

## Interface de Dados

### Agendamento
```typescript
interface Agendamento {
  id?: string;
  title: string;
  description?: string;
  start: { dateTime: string; timeZone: string; };
  end: { dateTime: string; timeZone: string; };
  attendees?: Array<{ email: string; displayName?: string; }>;
  location?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
  // Campos customizados Essenza
  servicoId?: number;
  servicoNome?: string;
  clienteId?: number;
  clienteNome?: string;
  profissionalId?: number;
  profissionalNome?: string;
  valor?: number;
  observacoes?: string;
  statusPagamento?: 'pendente' | 'pago' | 'cancelado';
}
```

## Navegação

### Rotas
- `/cliente-agendamentos` - Página de agendamentos do cliente
- Integração com navbar para clientes logados
- Redirecionamento automático após login

### Links na Navbar
- "Meus Agendamentos" aparece apenas para clientes logados
- Link ativo quando na página de agendamentos
- Integração com sistema de autenticação

## Responsividade

### Desktop
- Layout em colunas com filtros laterais
- Cards de agendamentos com informações completas
- Ações em botões agrupados

### Tablet
- Layout adaptado com filtros empilhados
- Cards responsivos
- Botões de ação reorganizados

### Mobile
- Layout vertical otimizado
- Filtros em dropdown
- Ações em botões full-width
- Navegação por toque

## Próximos Passos

### Funcionalidades Futuras
- [ ] Modal de detalhes do agendamento
- [ ] Sistema de reagendamento
- [ ] Notificações push
- [ ] Lembretes automáticos
- [ ] Avaliações pós-tratamento
- [ ] Histórico detalhado

### Melhorias Técnicas
- [ ] Cache de agendamentos
- [ ] Offline support
- [ ] Sincronização em tempo real
- [ ] PWA capabilities
- [ ] Testes automatizados

### Integrações
- [ ] WhatsApp para lembretes
- [ ] Email marketing
- [ ] Sistema de pagamentos
- [ ] Relatórios avançados

## Configuração do Backend

### Endpoints Necessários
```typescript
// Agendamentos
GET    /agendamentos/cliente/:id
POST   /agendamentos
PATCH  /agendamentos/:id
PATCH  /agendamentos/:id/cancelar
PATCH  /agendamentos/:id/confirmar

// Google Calendar
GET    /auth/google-calendar
POST   /agendamentos/sincronizar-google
POST   /agendamentos/google/evento
PATCH  /agendamentos/google/evento/:id
DELETE /agendamentos/google/evento/:id

// Disponibilidade
GET    /agendamentos/disponibilidade/:profissionalId
```

## Segurança

### Autenticação
- Verificação de token JWT
- Validação de permissões por tipo de usuário
- Proteção de rotas sensíveis

### Dados
- Validação de entrada
- Sanitização de dados
- Criptografia de informações sensíveis

## Suporte

Para dúvidas ou problemas com o sistema de agendamentos:
1. Consulte a documentação do Google Calendar API
2. Verifique os logs do backend
3. Entre em contato com a equipe de desenvolvimento

## Dependências

- Angular 17+
- Google Calendar API v3
- Bootstrap 5
- Bootstrap Icons
- RxJS
- Angular Router
- Angular Common
