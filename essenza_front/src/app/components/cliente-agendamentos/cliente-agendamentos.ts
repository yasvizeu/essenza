import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AgendamentosService, Agendamento } from '../../services/agendamentos';
import { ServicosService, Servico } from '../../services/servicos';
import { AgendamentoModalComponent } from '../agendamento-modal/agendamento-modal';

@Component({
  selector: 'app-cliente-agendamentos',
  templateUrl: './cliente-agendamentos.html',
  styleUrl: './cliente-agendamentos.scss',
  imports: [CommonModule, FormsModule, AgendamentoModalComponent],
  standalone: true
})
export class ClienteAgendamentosComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  agendamentos: Agendamento[] = [];
  servicos: Servico[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = '';

  // Filtros
  filtroStatus = 'todos';
  filtroPeriodo = 'todos';

  // Estados
  showEmptyState = false;
  showServicos = false;
  showAgendamentoModal = false;
  selectedServicoParaAgendamento: Servico | null = null;

  constructor(
    private authService: AuthService,
    private agendamentosService: AgendamentosService,
    private servicosService: ServicosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar se o usuário está autenticado
    if (!this.authService.isAuthenticated() || !this.authService.isCliente()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    this.loadAgendamentos();
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  loadAgendamentos(): void {
    if (!this.currentUser?.id) {
      this.hasError = true;
      this.errorMessage = 'Usuário não encontrado';
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    this.agendamentosService.getAgendamentosCliente(this.currentUser.id).subscribe({
      next: (agendamentos) => {
        this.agendamentos = this.agendamentosService.ordenarPorData(agendamentos, true);
        this.agendamentosService.atualizarAgendamentosLocais(agendamentos);
        
        // Verificar se há agendamentos
        if (this.agendamentos.length === 0) {
          this.showEmptyState = true;
          this.loadServicos();
        } else {
          this.showEmptyState = false;
          this.showServicos = false;
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar agendamentos:', error);
        this.hasError = true;
        this.errorMessage = 'Erro ao carregar agendamentos. Tente novamente.';
        this.isLoading = false;
        this.showEmptyState = true;
        this.loadServicos();
      }
    });
  }

  loadServicos(): void {
    this.servicosService.getServicos().subscribe({
      next: (servicos) => {
        this.servicos = servicos;
        this.showServicos = true;
      },
      error: (error) => {
        console.error('Erro ao carregar serviços:', error);
      }
    });
  }

  // Filtros
  onFiltroStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filtroStatus = target.value;
    this.aplicarFiltros();
  }

  onFiltroPeriodoChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filtroPeriodo = target.value;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    let agendamentosFiltrados = [...this.agendamentos];

    // Filtrar por status
    if (this.filtroStatus !== 'todos') {
      agendamentosFiltrados = this.agendamentosService.filtrarPorStatus(
        agendamentosFiltrados, 
        this.filtroStatus
      );
    }

    // Filtrar por período
    if (this.filtroPeriodo !== 'todos') {
      const hoje = new Date();
      let dataInicio: string;
      let dataFim: string;

      switch (this.filtroPeriodo) {
        case 'hoje':
          dataInicio = hoje.toISOString().split('T')[0];
          dataFim = hoje.toISOString().split('T')[0];
          break;
        case 'semana':
          dataInicio = hoje.toISOString().split('T')[0];
          const proximaSemana = new Date(hoje);
          proximaSemana.setDate(hoje.getDate() + 7);
          dataFim = proximaSemana.toISOString().split('T')[0];
          break;
        case 'mes':
          dataInicio = hoje.toISOString().split('T')[0];
          const proximoMes = new Date(hoje);
          proximoMes.setMonth(hoje.getMonth() + 1);
          dataFim = proximoMes.toISOString().split('T')[0];
          break;
        default:
          return;
      }

      agendamentosFiltrados = this.agendamentosService.filtrarPorPeriodo(
        agendamentosFiltrados,
        dataInicio,
        dataFim
      );
    }

    // Atualizar lista filtrada
    this.agendamentos = agendamentosFiltrados;
  }

  // Ações
  confirmarAgendamento(agendamento: Agendamento): void {
    if (!agendamento.id) return;

    this.agendamentosService.confirmarAgendamento(agendamento.id).subscribe({
      next: (agendamentoAtualizado) => {
        // Atualizar na lista local
        const index = this.agendamentos.findIndex(a => a.id === agendamento.id);
        if (index !== -1) {
          this.agendamentos[index] = agendamentoAtualizado;
        }
        this.showSuccessMessage('Agendamento confirmado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao confirmar agendamento:', error);
        this.showErrorMessage('Erro ao confirmar agendamento. Tente novamente.');
      }
    });
  }

  cancelarAgendamento(agendamento: Agendamento): void {
    if (!agendamento.id) return;

    const confirmacao = confirm('Tem certeza que deseja cancelar este agendamento?');
    if (!confirmacao) return;

    this.agendamentosService.cancelarAgendamento(agendamento.id, 'Cancelado pelo cliente').subscribe({
      next: (agendamentoAtualizado) => {
        // Atualizar na lista local
        const index = this.agendamentos.findIndex(a => a.id === agendamento.id);
        if (index !== -1) {
          this.agendamentos[index] = agendamentoAtualizado;
        }
        this.showSuccessMessage('Agendamento cancelado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao cancelar agendamento:', error);
        this.showErrorMessage('Erro ao cancelar agendamento. Tente novamente.');
      }
    });
  }

  reagendarAgendamento(agendamento: Agendamento): void {
    // TODO: Implementar funcionalidade de reagendamento
    console.log('Reagendar agendamento:', agendamento);
    this.showInfoMessage('Funcionalidade de reagendamento em desenvolvimento.');
  }

  verDetalhesAgendamento(agendamento: Agendamento): void {
    // TODO: Implementar modal de detalhes
    console.log('Ver detalhes do agendamento:', agendamento);
  }

  // Navegação
  goToNovoAgendamento(): void {
    // Mostrar modal de seleção de serviço ou ir para página de serviços
    this.showInfoMessage('Selecione um serviço para agendar.');
  }

  openAgendamentoModal(servico: Servico): void {
    if (!this.authService.isAuthenticated() || !this.authService.isCliente()) {
      this.showErrorMessage('Você precisa estar logado como cliente para agendar.');
      return;
    }

    this.selectedServicoParaAgendamento = servico;
    this.showAgendamentoModal = true;
  }

  closeAgendamentoModal(): void {
    this.showAgendamentoModal = false;
    this.selectedServicoParaAgendamento = null;
  }

  onAgendamentoCriado(agendamento: any): void {
    this.showSuccessMessage('Agendamento criado com sucesso!');
    this.loadAgendamentos(); // Recarregar lista de agendamentos
  }

  goToServico(servico: Servico): void {
    // TODO: Implementar navegação para detalhes do serviço
    console.log('Navegar para serviço:', servico);
  }

  // Métodos auxiliares para serviços
  getServicoImage(servico: Servico): string {
    if (servico.imagem) {
      return servico.imagem;
    }
    
    const servicoImages: { [key: string]: string } = {
      'Limpeza de Pele': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Tratamento Anti-idade': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Hidratação': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Peeling': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Acne': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    };

    for (const [key, image] of Object.entries(servicoImages)) {
      if (servico.nome.toLowerCase().includes(key.toLowerCase())) {
        return image;
      }
    }

    return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  }

  formatPrice(price: number): string {
    return this.servicosService.formatPrice(price);
  }

  formatDuration(minutes: number): string {
    return this.servicosService.formatDuration(minutes);
  }

  goToClienteHome(): void {
    this.router.navigate(['/cliente-home']);
  }

  // Formatação
  formatarData(data: string): string {
    return this.agendamentosService.formatarData(data);
  }

  formatarHorario(data: string): string {
    return this.agendamentosService.formatarHorario(data);
  }

  formatarDataHorario(data: string): string {
    return this.agendamentosService.formatarDataHorario(data);
  }

  isHoje(data: string): boolean {
    return this.agendamentosService.isHoje(data);
  }

  isAmanha(data: string): boolean {
    return this.agendamentosService.isAmanha(data);
  }

  isProximo(data: string): boolean {
    return this.agendamentosService.isProximo(data);
  }

  isPassado(data: string): boolean {
    return this.agendamentosService.isPassado(data);
  }

  getStatusClass(status: string): string {
    return this.agendamentosService.getStatusClass(status);
  }

  getStatusText(status: string): string {
    return this.agendamentosService.getStatusText(status);
  }

  getStatusPagamentoClass(status: string): string {
    return this.agendamentosService.getStatusPagamentoClass(status);
  }

  getStatusPagamentoText(status: string): string {
    return this.agendamentosService.getStatusPagamentoText(status);
  }

  // Mensagens
  private showSuccessMessage(message: string): void {
    this.showNotification(message, 'success');
  }

  private showErrorMessage(message: string): void {
    this.showNotification(message, 'danger');
  }

  private showInfoMessage(message: string): void {
    this.showNotification(message, 'info');
  }

  private showNotification(message: string, type: string): void {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
      ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 4000);
  }

  // Refresh
  refreshAgendamentos(): void {
    this.loadAgendamentos();
  }
}
