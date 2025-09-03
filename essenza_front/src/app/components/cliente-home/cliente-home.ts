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
    
    this.cartSubscription = this.cartService.getCartObservable().subscribe(cart => {
      this.cart = cart;
    });
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

  loadServicos(): void {
    this.isLoading = true;
    this.servicosService.getServicos().subscribe({
      next: (servicos) => {
        this.servicos = servicos;
        // Simular serviços favoritos (em produção, viria do backend)
        this.servicosFavoritos = servicos.slice(0, 3);
        this.isLoading = false;
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
      const cartItem: Omit<CartItem, 'quantidade'> = {
        id: this.selectedServico.id,
        nome: this.selectedServico.nome,
        descricao: this.selectedServico.descricao,
        preco: this.selectedServico.preco,
        tipo: 'servico',
        imagem: this.selectedServico.imagem
      };

      this.cartService.addItem(cartItem, this.quantidade);
      this.closeModal();
      this.showSuccessMessage();
    }
  }

  showSuccessMessage(): void {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      <i class="bi bi-check-circle me-2"></i>
      Serviço adicionado ao carrinho com sucesso!
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  incrementQuantity(): void {
    this.quantidade++;
  }

  decrementQuantity(): void {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  formatPrice(price: number): string {
    return this.servicosService.formatPrice(price);
  }

  formatDuration(minutes: number): string {
    return this.servicosService.formatDuration(minutes);
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
    // TODO: Implementar página de carrinho
    console.log('Navegar para carrinho - página ainda não implementada');
    // this.router.navigate(['/carrinho']);
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
}
