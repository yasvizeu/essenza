import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth';

export interface Agendamento {
  id?: string;
  title: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  location?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
  created?: string;
  updated?: string;
  // Campos customizados para o sistema Essenza
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

  // Buscar agendamentos do cliente
  getAgendamentosCliente(clienteId: number): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.apiUrl}/agendamentos/cliente/${clienteId}`);
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

  // Atualizar agendamento
  atualizarAgendamento(id: string, agendamento: Partial<Agendamento>): Observable<Agendamento> {
    return this.http.patch<Agendamento>(`${this.apiUrl}/agendamentos/${id}`, agendamento);
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
      const dataAgendamento = new Date(agendamento.start.dateTime);
      return dataAgendamento >= inicio && dataAgendamento <= fim;
    });
  }

  // Ordenar agendamentos por data
  ordenarPorData(agendamentos: Agendamento[], crescente: boolean = true): Agendamento[] {
    return agendamentos.sort((a, b) => {
      const dataA = new Date(a.start.dateTime);
      const dataB = new Date(b.start.dateTime);
      return crescente ? dataA.getTime() - dataB.getTime() : dataB.getTime() - dataA.getTime();
    });
  }
}
