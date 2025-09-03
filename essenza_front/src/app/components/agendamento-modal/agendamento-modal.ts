import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendamentosService, NovoAgendamento, Disponibilidade } from '../../services/agendamentos';
import { ServicosService, Servico } from '../../services/servicos';
import { AuthService } from '../../services/auth';

export interface Profissional {
  id: number;
  nome: string;
  especialidade?: string;
  avatar?: string;
}

@Component({
  selector: 'app-agendamento-modal',
  templateUrl: './agendamento-modal.html',
  styleUrl: './agendamento-modal.scss',
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class AgendamentoModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() servico: Servico | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() agendamentoCriado = new EventEmitter<any>();

  // Dados do formulário
  selectedProfissional: Profissional | null = null;
  selectedData: string = '';
  selectedHorario: string = '';
  observacoes: string = '';

  // Estados
  isLoading = false;
  isLoadingDisponibilidade = false;
  hasError = false;
  errorMessage = '';

  // Dados
  profissionais: Profissional[] = [];
  disponibilidade: Disponibilidade | null = null;
  horariosDisponiveis: string[] = [];
  datasDisponiveis: string[] = [];

  // Configurações
  readonly diasAntecedencia = 30; // Dias que podem ser agendados com antecedência
  readonly horarioInicio = 8; // 8:00
  readonly horarioFim = 18; // 18:00
  readonly intervaloMinutos = 30; // Intervalo de 30 minutos

  constructor(
    private agendamentosService: AgendamentosService,
    private servicosService: ServicosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('🔍 Modal inicializado:', { servico: this.servico, isOpen: this.isOpen });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('🔍 Mudanças detectadas:', changes);
    if (changes['servico'] && this.servico) {
      this.initializeModal();
    }
    if (changes['isOpen'] && this.isOpen && this.servico) {
      this.initializeModal();
    }
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  private initializeModal(): void {
    console.log('🔍 Inicializando modal:', { servico: this.servico, isOpen: this.isOpen });
    if (this.servico && this.isOpen) {
      console.log('🔍 Carregando dados do modal...');
      this.loadProfissionais();
      this.generateDatasDisponiveis();
    }
  }

  private loadProfissionais(): void {
    console.log('🔍 Carregando profissionais...');
    // TODO: Implementar carregamento de profissionais do backend
    // Por enquanto, usando dados mockados
    this.profissionais = [
      {
        id: 1,
        nome: 'Dra. Maria Silva',
        especialidade: 'Dermatologia Estética',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 2,
        nome: 'Dra. Ana Costa',
        especialidade: 'Estética Facial',
        avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 3,
        nome: 'Dr. João Santos',
        especialidade: 'Estética Corporal',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      }
    ];
  }

  private generateDatasDisponiveis(): void {
    const datas: string[] = [];
    const hoje = new Date();
    
    for (let i = 1; i <= this.diasAntecedencia; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      
      // Não incluir domingos (0) e sábados (6)
      if (data.getDay() !== 0 && data.getDay() !== 6) {
        datas.push(data.toISOString().split('T')[0]);
      }
    }
    
    this.datasDisponiveis = datas;
  }

  selectProfissional(profissional: Profissional): void {
    console.log('🔍 Selecionando profissional:', profissional);
    this.selectedProfissional = profissional;
    this.onProfissionalChange();
  }

  onProfissionalChange(): void {
    console.log('🔍 Profissional selecionado:', this.selectedProfissional);
    if (this.selectedProfissional && this.selectedData) {
      this.loadDisponibilidade();
    }
    this.selectedHorario = '';
    this.horariosDisponiveis = [];
  }

  onDataChange(): void {
    if (this.selectedProfissional && this.selectedData) {
      this.loadDisponibilidade();
    }
    this.selectedHorario = '';
    this.horariosDisponiveis = [];
  }

  private loadDisponibilidade(): void {
    if (!this.selectedProfissional || !this.selectedData) return;

    this.isLoadingDisponibilidade = true;
    this.hasError = false;

    // Buscar agendamentos existentes para o profissional na data selecionada
    this.agendamentosService.getAgendamentosProfissional(this.selectedProfissional.id).subscribe({
      next: (agendamentos) => {
        this.processarDisponibilidade(agendamentos);
        this.isLoadingDisponibilidade = false;
      },
      error: (error) => {
        console.error('Erro ao carregar disponibilidade:', error);
        // Em caso de erro, usar simulação
        this.simulateDisponibilidade();
        this.isLoadingDisponibilidade = false;
      }
    });
  }

  private processarDisponibilidade(agendamentos: any[]): void {
    console.log('🔍 Processando disponibilidade:', { agendamentos, selectedData: this.selectedData });
    
    // Filtrar agendamentos da data selecionada
    const agendamentosDoDia = agendamentos.filter(ag => {
      const dataAgendamento = new Date(ag.start.dateTime).toISOString().split('T')[0];
      return dataAgendamento === this.selectedData && ag.status !== 'cancelled';
    });

    console.log('🔍 Agendamentos do dia:', agendamentosDoDia);

    // Extrair horários ocupados
    const horariosOcupados = agendamentosDoDia.map(ag => {
      const dataHora = new Date(ag.start.dateTime);
      return `${dataHora.getHours().toString().padStart(2, '0')}:${dataHora.getMinutes().toString().padStart(2, '0')}`;
    });

    console.log('🔍 Horários ocupados:', horariosOcupados);

    // Gerar todos os horários possíveis e filtrar os disponíveis
    const todosHorarios = this.generateHorariosDisponiveis();
    this.horariosDisponiveis = todosHorarios.filter(horario => 
      !horariosOcupados.includes(horario)
    );

    console.log('🔍 Horários disponíveis:', this.horariosDisponiveis);
  }

  private simulateDisponibilidade(): void {
    // Simular horários disponíveis (removendo alguns aleatoriamente)
    const todosHorarios = this.generateHorariosDisponiveis();
    const horariosOcupados = this.getHorariosOcupados();
    
    this.horariosDisponiveis = todosHorarios.filter(horario => 
      !horariosOcupados.includes(horario)
    );
  }

  private generateHorariosDisponiveis(): string[] {
    const horarios: string[] = [];
    
    for (let hora = this.horarioInicio; hora < this.horarioFim; hora++) {
      for (let minuto = 0; minuto < 60; minuto += this.intervaloMinutos) {
        const horario = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        horarios.push(horario);
      }
    }
    
    return horarios;
  }

  private getHorariosOcupados(): string[] {
    // Simular alguns horários ocupados
    const ocupados = ['09:00', '10:30', '14:00', '15:30'];
    return ocupados;
  }

  onHorarioSelect(horario: string): void {
    console.log('🔍 Horário selecionado:', horario);
    this.selectedHorario = horario;
  }

  onImageError(event: any, profissional: Profissional): void {
    console.log('🔍 Erro ao carregar imagem do profissional:', profissional.nome);
    // Definir uma imagem de fallback
    event.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80';
  }

  canConfirmAgendamento(): boolean {
    return !!(
      this.servico &&
      this.selectedProfissional &&
      this.selectedData &&
      this.selectedHorario &&
      this.authService.isAuthenticated() &&
      this.authService.isCliente()
    );
  }

  confirmarAgendamento(): void {
    console.log('🔍 Iniciando confirmação de agendamento...');
    console.log('🔍 Usuário autenticado:', this.authService.isAuthenticated());
    console.log('🔍 É cliente:', this.authService.isCliente());
    console.log('🔍 Token:', this.authService.getAccessToken() ? 'Token presente' : 'Token ausente');
    console.log('🔍 Token completo:', this.authService.getAccessToken());
    
    // Verificar se o token está expirado
    if (this.authService.isTokenExpired()) {
      console.log('🔍 Token expirado, fazendo logout...');
      this.authService.logout();
      this.showError('Sua sessão expirou. Faça login novamente.');
      return;
    }
    
    // Verificar se o usuário está realmente logado
    if (!this.authService.isAuthenticated() || !this.authService.isCliente()) {
      this.showError('Você precisa estar logado como cliente para agendar');
      return;
    }
    
    if (!this.canConfirmAgendamento()) {
      this.showError('Preencha todos os campos obrigatórios');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    console.log('🔍 Usuário atual:', currentUser);
    if (!currentUser) {
      this.showError('Usuário não encontrado');
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    // Criar data/hora de início e fim
    const dataHoraInicio = new Date(`${this.selectedData}T${this.selectedHorario}:00`);
    const dataHoraFim = new Date(dataHoraInicio);
    dataHoraFim.setMinutes(dataHoraFim.getMinutes() + (this.servico!.duracao || 60));

    const novoAgendamento = {
      title: `${this.servico!.nome} - ${currentUser.nome}`,
      description: this.observacoes || `Agendamento de ${this.servico!.nome}`,
      startDateTime: dataHoraInicio.toISOString(),
      endDateTime: dataHoraFim.toISOString(),
      timeZone: 'America/Sao_Paulo',
      location: 'Essenza - Clínica de Estética',
      status: 'tentative' as const,
      statusPagamento: 'pendente' as const,
      valor: this.servico!.preco,
      observacoes: this.observacoes,
      clienteId: currentUser.id,
      profissionalId: this.selectedProfissional!.id,
      servicoId: this.servico!.id
    };

    this.agendamentosService.criarAgendamento(novoAgendamento as any).subscribe({
      next: (agendamento) => {
        this.isLoading = false;
        this.showSuccess('Agendamento criado com sucesso!');
        this.agendamentoCriado.emit(agendamento);
        this.closeModal();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao criar agendamento:', error);
        this.showError('Erro ao criar agendamento. Tente novamente.');
      }
    });
  }

  closeModal(): void {
    this.resetForm();
    this.close.emit();
  }

  private resetForm(): void {
    this.selectedProfissional = null;
    this.selectedData = '';
    this.selectedHorario = '';
    this.observacoes = '';
    this.disponibilidade = null;
    this.horariosDisponiveis = [];
    this.hasError = false;
    this.errorMessage = '';
  }

  private showError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
  }

  private showSuccess(message: string): void {
    // Criar notificação de sucesso
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      <i class="bi bi-check-circle me-2"></i>
      ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Formatação
  formatarData(data: string): string {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  formatarPreco(preco: number): string {
    return this.servicosService.formatPrice(preco);
  }

  formatarDuracao(minutes: number): string {
    return this.servicosService.formatDuration(minutes);
  }

  // Verificações
  isHorarioDisponivel(horario: string): boolean {
    return this.horariosDisponiveis.includes(horario);
  }

  isHorarioSelecionado(horario: string): boolean {
    return this.selectedHorario === horario;
  }

  // Getters
  get servicoNome(): string {
    return this.servico?.nome || '';
  }

  get servicoPreco(): number {
    return this.servico?.preco || 0;
  }

  get servicoDuracao(): number {
    return this.servico?.duracao || 60;
  }

  get servicoDescricao(): string {
    return this.servico?.descricao || '';
  }
}
