import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth';

export interface Agendamento {
  id?: string | number;
  title: string;
  description?: string;
  start?: {
    dateTime: string;
    timeZone: string;
  };
  end?: {
    dateTime: string;
    timeZone: string;
  };
  // Campos do backend (NestJS)
  startDateTime?: string;
  endDateTime?: string;
  timeZone?: string;
  location?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
  created?: string;
  updated?: string;
  createdAt?: string;
  updatedAt?: string;
  // Relacionamentos
  cliente?: {
    id: number;
    nome: string;
    email: string;
    cell: string;
  };
  servico?: {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
  };
  profissional?: {
    id: number;
    nome: string;
    email: string;
  };
  // IDs
  servicoId?: number;
  clienteId?: number;
  profissionalId?: number;
  // Campos customizados para o sistema Essenza
  servicoNome?: string;
  clienteNome?: string;
  profissionalNome?: string;
  valor?: number;
  observacoes?: string;
  statusPagamento?: 'pendente' | 'pago' | 'cancelado';
  googleEventId?: string;
}

export interface NovoAgendamento {
  servicoId: number;
  clienteId: number;
  profissionalId: number;
  data: string; // YYYY-MM-DD
  horario: string; // HH:MM
  duracao: number; // em minutos
  observacoes?: string;
}

export interface Disponibilidade {
  profissionalId: number;
  data: string;
  horariosDisponiveis: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentosService {
  private apiUrl = 'http://localhost:3000'; // URL do backend NestJS
  private googleCalendarApiUrl = 'https://www.googleapis.com/calendar/v3';
  
  private agendamentosSubject = new BehaviorSubject<Agendamento[]>([]);
  public agendamentos$ = this.agendamentosSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ===== MÉTODOS DO BACKEND (NestJS) =====

  // Criar novo agendamento
  criarAgendamento(agendamento: NovoAgendamento): Observable<Agendamento> {
    return this.http.post<Agendamento>(`${this.apiUrl}/agendamentos`, agendamento);
  }

  // Criar agendamento com formato do backend
  criarAgendamentoCompleto(agendamento: any): Observable<Agendamento> {
    console.log('🔍 Debug - Criando agendamento completo:', agendamento);
    return this.http.post<Agendamento>(`${this.apiUrl}/agendamentos`, agendamento);
  }

  // Buscar agendamentos do cliente
  getAgendamentosCliente(clienteId: number): Observable<Agendamento[]> {
    console.log('🔍 Debug - Buscando agendamentos para cliente ID:', clienteId);
    
    // Mock data por enquanto - em produção, usar o endpoint real
    const mockAgendamentos: Agendamento[] = [
      {
        id: '1',
        title: 'Limpeza de Pele Profunda',
        description: 'Tratamento facial completo',
        start: {
          dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Sao_Paulo'
        },
        end: {
          dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Sao_Paulo'
        },
        servicoId: 1,
        servicoNome: 'Limpeza de Pele Profunda',
        clienteId: clienteId,
        clienteNome: 'Cliente Teste',
        profissionalId: 1,
        profissionalNome: 'Dr. Ana Silva',
        valor: 120,
        observacoes: 'Primeira sessão',
        status: 'confirmed',
        statusPagamento: 'pago'
      },
      {
        id: '2',
        title: 'Hidratação Intensiva',
        description: 'Tratamento de hidratação profunda',
        start: {
          dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Sao_Paulo'
        },
        end: {
          dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
          timeZone: 'America/Sao_Paulo'
        },
        servicoId: 3,
        servicoNome: 'Hidratação Intensiva',
        clienteId: clienteId,
        clienteNome: 'Cliente Teste',
        profissionalId: 1,
        profissionalNome: 'Dr. Ana Silva',
        valor: 95,
        observacoes: 'Sessão de manutenção',
        status: 'confirmed',
        statusPagamento: 'pago'
      }
    ];

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockAgendamentos);
        observer.complete();
      }, 1000); // Simular delay de rede
    });
  }

  // Buscar serviços pagos não agendados do cliente
  getServicosPagosNaoAgendados(clienteId: number): Observable<any[]> {
    console.log('🔍 Debug - Buscando serviços pagos não agendados para cliente ID:', clienteId);
    // Usar endpoint existente e filtrar no frontend
    return this.http.get<any[]>(`${this.apiUrl}/agendamentos/cliente/${clienteId}`).pipe(
      map(agendamentos => {
        console.log('🔍 Debug - Todos os agendamentos do cliente:', agendamentos);
        // Filtrar apenas agendamentos pagos não agendados
        const filtrados = agendamentos.filter(agendamento => 
          agendamento.statusPagamento === 'pago' && 
          agendamento.status === 'tentative'
        );
        console.log('🔍 Debug - Agendamentos filtrados (pagos não agendados):', filtrados);
        return filtrados;
      })
    );
  }

  // Atualizar agendamento
  atualizarAgendamento(agendamentoId: string | number, dadosAtualizacao: any): Observable<Agendamento> {
    console.log('🔍 Debug - Atualizando agendamento ID:', agendamentoId, 'dados:', dadosAtualizacao);
    return this.http.put<Agendamento>(`${this.apiUrl}/agendamentos/${agendamentoId}`, dadosAtualizacao);
  }

  // Remover agendamento
  removerAgendamento(agendamentoId: string | number): Observable<any> {
    console.log('🔍 Debug - Removendo agendamento ID:', agendamentoId);
    return this.http.delete(`${this.apiUrl}/agendamentos/${agendamentoId}`);
  }

  // Buscar agendamentos do profissional
  getAgendamentosProfissional(profissionalId: number): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.apiUrl}/agendamentos/profissional/${profissionalId}`);
  }

  // Buscar agendamentos por período
  getAgendamentosPorPeriodo(
    profissionalId: number, 
    dataInicio: string, 
    dataFim: string
  ): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(
      `${this.apiUrl}/agendamentos/profissional/${profissionalId}?inicio=${dataInicio}&fim=${dataFim}`
    );
  }


  // Cancelar agendamento
  cancelarAgendamento(id: string, motivo?: string): Observable<Agendamento> {
    return this.http.patch<Agendamento>(`${this.apiUrl}/agendamentos/${id}/cancelar`, { motivo });
  }

  // Confirmar agendamento
  confirmarAgendamento(id: string): Observable<Agendamento> {
    return this.http.patch<Agendamento>(`${this.apiUrl}/agendamentos/${id}/confirmar`, {});
  }

  // Buscar disponibilidade do profissional
  getDisponibilidadeProfissional(
    profissionalId: number, 
    data: string
  ): Observable<Disponibilidade> {
    return this.http.get<Disponibilidade>(
      `${this.apiUrl}/agendamentos/disponibilidade/${profissionalId}?data=${data}`
    );
  }

  // ===== MÉTODOS DO GOOGLE CALENDAR API =====

  // Autenticar com Google Calendar
  autenticarGoogleCalendar(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/google-calendar`);
  }

  // Sincronizar agendamentos com Google Calendar
  sincronizarComGoogleCalendar(profissionalId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/agendamentos/sincronizar-google`, { profissionalId });
  }

  // Criar evento no Google Calendar
  criarEventoGoogleCalendar(agendamento: Agendamento): Observable<any> {
    return this.http.post(`${this.apiUrl}/agendamentos/google/evento`, agendamento);
  }

  // Atualizar evento no Google Calendar
  atualizarEventoGoogleCalendar(eventId: string, agendamento: Partial<Agendamento>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/agendamentos/google/evento/${eventId}`, agendamento);
  }

  // Deletar evento do Google Calendar
  deletarEventoGoogleCalendar(eventId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/agendamentos/google/evento/${eventId}`);
  }

  // ===== MÉTODOS AUXILIARES =====

  // Formatar data para exibição
  formatarData(data: string): string {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Formatar horário para exibição
  formatarHorario(data: string): string {
    const date = new Date(data);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Formatar data e horário juntos
  formatarDataHorario(data: string): string {
    const date = new Date(data);
    return date.toLocaleString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Verificar se agendamento é hoje
  isHoje(data: string): boolean {
    const hoje = new Date();
    const dataAgendamento = new Date(data);
    return hoje.toDateString() === dataAgendamento.toDateString();
  }

  // Verificar se agendamento é amanhã
  isAmanha(data: string): boolean {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataAgendamento = new Date(data);
    return amanha.toDateString() === dataAgendamento.toDateString();
  }

  // Verificar se agendamento é próximo (próximos 7 dias)
  isProximo(data: string): boolean {
    const hoje = new Date();
    const proximaSemana = new Date();
    proximaSemana.setDate(hoje.getDate() + 7);
    const dataAgendamento = new Date(data);
    return dataAgendamento >= hoje && dataAgendamento <= proximaSemana;
  }

  // Verificar se agendamento já passou
  isPassado(data: string): boolean {
    const hoje = new Date();
    const dataAgendamento = new Date(data);
    return dataAgendamento < hoje;
  }

  // Obter classe CSS para status
  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'badge bg-success';
      case 'tentative':
        return 'badge bg-warning';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  // Obter texto do status
  getStatusText(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'tentative':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }

  // Obter classe CSS para status de pagamento
  getStatusPagamentoClass(status: string): string {
    switch (status) {
      case 'pago':
        return 'badge bg-success';
      case 'pendente':
        return 'badge bg-warning';
      case 'cancelado':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  // Obter texto do status de pagamento
  getStatusPagamentoText(status: string): string {
    switch (status) {
      case 'pago':
        return 'Pago';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  }

  // Gerar horários disponíveis (exemplo)
  gerarHorariosDisponiveis(): string[] {
    const horarios: string[] = [];
    for (let hora = 8; hora <= 18; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horario = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        horarios.push(horario);
      }
    }
    return horarios;
  }

  // Atualizar lista local de agendamentos
  atualizarAgendamentosLocais(agendamentos: Agendamento[]): void {
    this.agendamentosSubject.next(agendamentos);
  }

  // Obter agendamentos locais
  getAgendamentosLocais(): Agendamento[] {
    return this.agendamentosSubject.value;
  }

  // Filtrar agendamentos por status
  filtrarPorStatus(agendamentos: Agendamento[], status: string): Agendamento[] {
    return agendamentos.filter(agendamento => agendamento.status === status);
  }

  // Filtrar agendamentos por período
  filtrarPorPeriodo(agendamentos: Agendamento[], dataInicio: string, dataFim: string): Agendamento[] {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    return agendamentos.filter(agendamento => {
      if (!agendamento.startDateTime) return false;
      const dataAgendamento = new Date(agendamento.startDateTime as string);
      return dataAgendamento >= inicio && dataAgendamento <= fim;
    });
  }

  // Ordenar agendamentos por data
  ordenarPorData(agendamentos: Agendamento[], crescente: boolean = true): Agendamento[] {
    console.log('🔍 Debug - ordenarPorData - Agendamentos recebidos:', agendamentos);
    console.log('🔍 Debug - ordenarPorData - Quantidade:', agendamentos.length);
    
    const resultado = agendamentos.sort((a, b) => {
      // Usar startDateTime se disponível, senão usar start.dateTime
      const dataA = a.startDateTime ? new Date(a.startDateTime as string) : 
                   (a.start?.dateTime ? new Date(a.start.dateTime) : new Date(0));
      const dataB = b.startDateTime ? new Date(b.startDateTime as string) : 
                   (b.start?.dateTime ? new Date(b.start.dateTime) : new Date(0));
      return crescente ? dataA.getTime() - dataB.getTime() : dataB.getTime() - dataA.getTime();
    });
    
    console.log('🔍 Debug - ordenarPorData - Resultado:', resultado);
    return resultado;
  }
}
