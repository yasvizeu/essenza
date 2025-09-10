import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ServicosService, Servico } from '../../services/servicos';
import { CartService, CartItem } from '../../services/cart';
import { AgendamentosService, Agendamento } from '../../services/agendamentos';

@Component({
  selector: 'app-cliente-home',
  templateUrl: './cliente-home.html',
  styleUrl: './cliente-home.scss',
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class ClienteHomeComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  servicos: Servico[] = [];
  isLoading = false;
  selectedServico: Servico | null = null;
  showModal = false;
  quantidade = 1;
  cart: any = { items: [], total: 0, itemCount: 0 };
  private cartSubscription: any;

  // Dados do dashboard do cliente
  proximosAgendamentos: any[] = [];
  historicoRecente: any[] = [];
  servicosFavoritos: Servico[] = [];
  pedidosPendentes: any[] = [];

  // Modal de agendamento
  showAgendamentoModal = false;
  servicoParaAgendar: any = null;
  profissionais: any[] = [];
  profissionalSelecionado: any = null;
  datasDisponiveis: string[] = [];
  dataSelecionada: string = '';
  horariosDisponiveis: string[] = [];
  horarioSelecionado: string = '';
  observacoesAgendamento: string = '';
  isLoadingAgendamento = false;
  isConfirmandoAgendamento = false;

  constructor(
    private authService: AuthService,
    private servicosService: ServicosService,
    private cartService: CartService,
    private agendamentosService: AgendamentosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar se o usuário está autenticado
    if (!this.authService.isAuthenticated() || !this.authService.isCliente()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    console.log('🔍 Debug - currentUser:', this.currentUser);
    this.loadServicos();
    this.loadDashboardData();
    
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });

    // Carregar carrinho se autenticado
    this.cartService.loadCartIfAuthenticated();
  }

  // Método para recarregar dados quando necessário
  refreshData(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  private loadDashboardData(): void {
    this.loadProximosAgendamentos();
    this.loadHistoricoRecente();
    this.loadPedidosPendentes();
  }

  private loadProximosAgendamentos(): void {
    if (!this.currentUser?.id) return;

    this.agendamentosService.getAgendamentosCliente(this.currentUser.id).subscribe({
      next: (agendamentos) => {
        // Filtrar apenas agendamentos futuros e limitar a 3
        const hoje = new Date();
        this.proximosAgendamentos = agendamentos
          .filter(ag => {
            const dataAgendamento = new Date(ag.start.dateTime);
            return dataAgendamento >= hoje && ag.status !== 'cancelled';
          })
          .slice(0, 3)
          .map(ag => ({
            id: ag.id,
            servico: ag.servicoNome || 'Serviço',
            data: ag.start.dateTime.split('T')[0], // Extrair apenas a data
            horario: ag.start.dateTime.split('T')[1]?.substring(0, 5) || '00:00', // Extrair apenas o horário
            profissional: ag.profissionalNome || 'Profissional',
            status: ag.status === 'confirmed' ? 'confirmado' : ag.status === 'tentative' ? 'pendente' : 'cancelado'
          }));
      },
      error: (error) => {
        console.error('Erro ao carregar próximos agendamentos:', error);
        this.proximosAgendamentos = [];
      }
    });
  }

  private loadHistoricoRecente(): void {
    if (!this.currentUser?.id) return;

    this.agendamentosService.getAgendamentosCliente(this.currentUser.id).subscribe({
      next: (agendamentos) => {
        // Filtrar apenas agendamentos concluídos e limitar a 3
        const hoje = new Date();
        this.historicoRecente = agendamentos
          .filter(ag => {
            const dataAgendamento = new Date(ag.start.dateTime);
            return dataAgendamento < hoje && ag.status === 'confirmed';
          })
          .slice(0, 3)
          .map(ag => ({
            id: ag.id,
            servico: ag.servicoNome || 'Serviço',
            data: ag.start.dateTime.split('T')[0], // Extrair apenas a data
            valor: ag.valor || 0,
            status: 'concluído'
          }));
      },
      error: (error) => {
        console.error('Erro ao carregar histórico recente:', error);
        this.historicoRecente = [];
      }
    });
  }

  private loadPedidosPendentes(): void {
    if (!this.currentUser?.id) return;

    // Simular pedidos pendentes (em produção, viria do backend)
    // Por enquanto, vamos simular com dados mockados
    this.pedidosPendentes = [
      {
        id: 1,
        servico: 'Limpeza de Pele Profunda',
        preco: 120,
        dataCompra: new Date().toISOString().split('T')[0],
        status: 'pago'
      },
      {
        id: 2,
        servico: 'Hidratação Intensiva',
        preco: 95,
        dataCompra: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pago'
      }
    ];
  }

  loadServicos(): void {
    this.isLoading = true;
    this.servicosService.getServicos(1, 12).subscribe({
      next: (response) => {
        this.servicos = response.data;
        // Simular serviços favoritos (em produção, viria do backend)
        this.servicosFavoritos = response.data.slice(0, 3);
        this.isLoading = false;
        console.log('🔍 Debug - Serviços carregados no cliente-home:', this.servicos.length);
      },
      error: (error) => {
        console.error('Erro ao carregar serviços:', error);
        this.isLoading = false;
      }
    });
  }

  openModal(servico: Servico): void {
    this.selectedServico = servico;
    this.quantidade = 1;
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedServico = null;
    document.body.classList.remove('modal-open');
  }

  addToCart(): void {
    if (this.selectedServico && this.quantidade > 0) {
      this.cartService.addToCart(this.selectedServico, this.quantidade).subscribe({
        next: () => {
          this.closeModal();
          this.showSuccessMessage('Serviço adicionado ao carrinho com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao adicionar ao carrinho:', error);
          alert('Erro ao adicionar ao carrinho. Tente novamente.');
        }
      });
    }
  }


  incrementQuantity(): void {
    this.quantidade++;
  }

  decrementQuantity(): void {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  formatPrice(price: number | string): string {
    return this.servicosService.formatPrice(price);
  }

  formatDuration(minutes: number): string {
    return this.servicosService.formatDuration(minutes);
  }

  // Calcular preço total (preço * quantidade)
  calculateTotalPrice(servico: Servico | null, quantidade: number): number {
    if (!servico?.preco) return 0;
    const numericPrice = typeof servico.preco === 'string' ? parseFloat(servico.preco) : servico.preco;
    return isNaN(numericPrice) ? 0 : numericPrice * quantidade;
  }

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

  // Navegação
  goToAgendamentos(): void {
    this.router.navigate(['/cliente-agendamentos']);
  }

  goToHistorico(): void {
    // Por enquanto, navega para a página de agendamentos que já tem histórico
    this.router.navigate(['/cliente-agendamentos'], { queryParams: { tab: 'historico' } });
  }

  goToPerfil(): void {
    // TODO: Implementar página de perfil do cliente
    console.log('Navegar para perfil - página ainda não implementada');
    // this.router.navigate(['/cliente-perfil']);
  }

  goToCarrinho(): void {
    this.router.navigate(['/carrinho']);
  }

  logout(): void {
    this.authService.logout();
  }

  // Formatação de data
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  // Formatação de status
  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmado':
        return 'badge bg-success';
      case 'pendente':
        return 'badge bg-warning';
      case 'concluído':
        return 'badge bg-primary';
      default:
        return 'badge bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'pendente':
        return 'Pendente';
      case 'concluído':
        return 'Concluído';
      default:
        return status;
    }
  }

  // Métodos para pedidos
  agendarServico(pedido: any): void {
    this.servicoParaAgendar = pedido;
    this.showAgendamentoModal = true;
    this.loadProfissionais();
    document.body.classList.add('modal-open');
  }

  verDetalhesPedido(pedido: any): void {
    // Implementar visualização de detalhes do pedido
    console.log('Ver detalhes do pedido:', pedido);
  }

  scrollToServicos(): void {
    const servicosSection = document.querySelector('.servicos-section');
    if (servicosSection) {
      servicosSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Métodos para status de pedidos
  getPedidoStatusClass(status: string): string {
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

  getPedidoStatusText(status: string): string {
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

  // Métodos para agendamento
  loadProfissionais(): void {
    this.isLoadingAgendamento = true;
    
    // Simular carregamento de profissionais (em produção, viria do backend)
    setTimeout(() => {
      this.profissionais = [
        { id: 1, nome: 'Dr. Ana Silva', especialidade: 'Dermatologia' },
        { id: 2, nome: 'Dra. Maria Santos', especialidade: 'Estética Facial' },
        { id: 3, nome: 'Dr. João Costa', especialidade: 'Tratamentos Corporais' }
      ];
      this.isLoadingAgendamento = false;
    }, 1000);
  }

  selecionarProfissional(profissional: any): void {
    this.profissionalSelecionado = profissional;
    this.dataSelecionada = '';
    this.horarioSelecionado = '';
    this.loadDatasDisponiveis();
  }

  loadDatasDisponiveis(): void {
    // Gerar próximas 7 datas disponíveis
    const datas = [];
    const hoje = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      datas.push(data.toISOString().split('T')[0]);
    }
    
    this.datasDisponiveis = datas;
  }

  selecionarData(data: string): void {
    this.dataSelecionada = data;
    this.horarioSelecionado = '';
    this.loadHorariosDisponiveis();
  }

  loadHorariosDisponiveis(): void {
    // Simular horários disponíveis (em produção, viria do backend)
    this.horariosDisponiveis = [
      '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
    ];
  }

  selecionarHorario(horario: string): void {
    this.horarioSelecionado = horario;
  }

  closeAgendamentoModal(): void {
    this.showAgendamentoModal = false;
    this.servicoParaAgendar = null;
    this.profissionalSelecionado = null;
    this.dataSelecionada = '';
    this.horarioSelecionado = '';
    this.observacoesAgendamento = '';
    this.profissionais = [];
    this.datasDisponiveis = [];
    this.horariosDisponiveis = [];
    document.body.classList.remove('modal-open');
  }

  confirmarAgendamento(): void {
    if (!this.horarioSelecionado) return;

    this.isConfirmandoAgendamento = true;

    // Simular confirmação do agendamento (em produção, faria requisição para o backend)
    setTimeout(() => {
      this.isConfirmandoAgendamento = false;
      this.closeAgendamentoModal();
      
      // Mostrar mensagem de sucesso
      this.showSuccessMessage('Agendamento confirmado com sucesso!');
      
      // Recarregar dados do dashboard
      this.loadDashboardData();
    }, 2000);
  }

  // Métodos para editar/cancelar agendamentos
  canEditAgendamento(agendamento: any): boolean {
    const dataAgendamento = new Date(agendamento.data);
    const hoje = new Date();
    const diffTime = dataAgendamento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 1; // Pode editar se for pelo menos 24h antes
  }

  canCancelAgendamento(agendamento: any): boolean {
    return this.canEditAgendamento(agendamento);
  }

  editarAgendamento(agendamento: any): void {
    // Implementar edição de agendamento
    console.log('Editar agendamento:', agendamento);
    this.showSuccessMessage('Funcionalidade de edição será implementada em breve!');
  }

  cancelarAgendamento(agendamento: any): void {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      // Implementar cancelamento de agendamento
      console.log('Cancelar agendamento:', agendamento);
      this.showSuccessMessage('Agendamento cancelado com sucesso!');
      this.loadDashboardData();
    }
  }

  showSuccessMessage(message: string): void {
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
}
