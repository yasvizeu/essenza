import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicosService, Servico, PaginatedResponse } from '../../services/servicos';
import { CartService, CartItem } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { AgendamentosService, Agendamento } from '../../services/agendamentos';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class Home implements OnInit, OnDestroy {
  servicos: Servico[] = [];
  isLoading = false;
  selectedServico: Servico | null = null;
  showModal = false;
  quantidade = 1;
  cart: any = { items: [], total: 0, itemCount: 0 };
  private cartSubscription: any;
  
  // Paginação
  currentPage = 1;
  pageSize = 12; // 12 cards por página (3 colunas x 4 linhas)
  totalPages = 0;
  hasNextPage = false;
  hasPrevPage = false;

  // Dados do usuário logado
  isAuthenticated = false;
  currentUser: any = null;
  
  // Agendamentos
  proximosAgendamentos: Agendamento[] = [];
  isLoadingAgendamentos = false;
  
  // Serviços recomendados
  servicosRecomendados: Servico[] = [];
  isLoadingRecomendados = false;
  
  // Modal de detalhes do agendamento
  showDetalhesModal = false;
  selectedAgendamentoDetalhes: Agendamento | null = null;

  constructor(
    private servicosService: ServicosService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private agendamentosService: AgendamentosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar autenticação
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
    
    this.loadServicos();
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
    
    // Carregar dados específicos do usuário se estiver logado
    if (this.isAuthenticated && this.currentUser?.tipo === 'cliente') {
      this.loadProximosAgendamentos();
      this.loadServicosRecomendados();
    }
    
    // Inicializar o carrossel após um pequeno delay
    setTimeout(() => {
      this.initCarousel();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  private initCarousel(): void {
    // Verificar se estamos no browser
    if (typeof window !== 'undefined') {
      // Verificar se o Bootstrap está carregado
      if (typeof (window as any).bootstrap !== 'undefined') {
        const carouselElement = document.getElementById('servicosCarousel');
        if (carouselElement) {
          const carousel = new (window as any).bootstrap.Carousel(carouselElement, {
            interval: 5000,
            ride: 'carousel',
            wrap: true
          });
          console.log('Carrossel inicializado com sucesso');
        }
      } else {
        console.log('Bootstrap não encontrado, tentando novamente em 500ms');
        setTimeout(() => this.initCarousel(), 500);
      }
    }
  }

  loadServicos(): void {
    this.isLoading = true;
    
    this.servicosService.getServicos(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Servico>) => {
        this.servicos = response.data || [];
        this.totalPages = response.pagination?.totalPages || 0;
        this.hasNextPage = response.pagination?.hasNext || false;
        this.hasPrevPage = response.pagination?.hasPrev || false;
        this.isLoading = false;
        
        // Forçar detecção de mudanças
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar serviços:', error);
        this.isLoading = false;
        this.servicos = [];
      }
    });
  }

  loadProximosAgendamentos(): void {
    if (!this.currentUser?.id) return;
    
    this.isLoadingAgendamentos = true;
    this.agendamentosService.getAgendamentosCliente(this.currentUser.id).subscribe({
      next: (agendamentos: Agendamento[]) => {
        // Filtrar apenas agendamentos confirmados e futuros
        const hoje = new Date();
        this.proximosAgendamentos = agendamentos
          .filter(ag => ag.status === 'confirmed' && new Date(ag.startDateTime!) >= hoje)
          .sort((a, b) => new Date(a.startDateTime!).getTime() - new Date(b.startDateTime!).getTime())
          .slice(0, 3); // Apenas os próximos 3
        this.isLoadingAgendamentos = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar agendamentos:', error);
        this.proximosAgendamentos = [];
        this.isLoadingAgendamentos = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadServicosRecomendados(): void {
    if (!this.currentUser?.id) return;
    
    this.isLoadingRecomendados = true;
    this.agendamentosService.getServicosPagosNaoAgendados(this.currentUser.id).subscribe({
      next: (agendamentos: Agendamento[]) => {
        // Extrair IDs dos serviços já agendados/pagos
        const servicosJaUtilizados = agendamentos.map(ag => ag.servico?.id).filter(id => id);
        
        // Buscar serviços similares (excluindo os já utilizados)
        this.servicosService.getServicos(1, 6).subscribe({
          next: (response: PaginatedResponse<Servico>) => {
            this.servicosRecomendados = response.data
              ?.filter(servico => !servicosJaUtilizados.includes(servico.id))
              .slice(0, 4) || []; // Apenas 4 recomendações
            this.isLoadingRecomendados = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Erro ao carregar serviços recomendados:', error);
            this.servicosRecomendados = [];
            this.isLoadingRecomendados = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (error) => {
        console.error('Erro ao carregar histórico de serviços:', error);
        this.servicosRecomendados = [];
        this.isLoadingRecomendados = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Métodos auxiliares
  formatarData(data: string): string {
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatarHora(data: string): string {
    const dataObj = new Date(data);
    return dataObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  navegarParaAgendamentos(): void {
    this.router.navigate(['/cliente-agendamentos']);
  }

  navegarParaServicos(): void {
    this.router.navigate(['/servicos']);
  }

  navegarParaSobre(): void {
    this.router.navigate(['/sobre']);
  }

  // Métodos do modal de detalhes do agendamento
  verDetalhesAgendamento(agendamento: Agendamento): void {
    this.selectedAgendamentoDetalhes = agendamento;
    this.showDetalhesModal = true;
    document.body.classList.add('modal-open');
  }

  closeDetalhesModal(): void {
    this.showDetalhesModal = false;
    this.selectedAgendamentoDetalhes = null;
    document.body.classList.remove('modal-open');
  }

  // Métodos de paginação
  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadServicos();
    }
  }

  prevPage(): void {
    if (this.hasPrevPage) {
      this.currentPage--;
      this.loadServicos();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadServicos();
    }
  }

  openModal(servico: Servico): void {
    this.selectedServico = servico;
    this.quantidade = 1;
    this.showModal = true;
    // Adicionar classe ao body para prevenir scroll
    document.body.classList.add('modal-open');
  }

  openModalFromCarousel(index: number): void {
    if (this.servicos[index]) {
      this.openModal(this.servicos[index]);
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedServico = null;
    // Remover classe do body
    document.body.classList.remove('modal-open');
  }

  addToCart(): void {
    if (this.selectedServico && this.quantidade > 0) {
      this.cartService.addToCart(this.selectedServico, this.quantidade).subscribe({
        next: () => {
          this.closeModal();
          this.showSuccessMessage();
        },
        error: (error) => {
          console.error('Erro ao adicionar ao carrinho:', error);
          alert('Erro ao adicionar ao carrinho. Tente novamente.');
        }
      });
    }
  }

  showSuccessMessage(): void {
    // Criar uma notificação temporária
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      <i class="bi bi-check-circle me-2"></i>
      Serviço adicionado ao carrinho com sucesso!
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
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
    
    // Imagens padrão baseadas no nome do serviço
    const servicoImages: { [key: string]: string } = {
      'Limpeza de Pele': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Tratamento Anti-idade': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Hidratação': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Peeling': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Acne': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    };

    // Tentar encontrar uma imagem baseada no nome
    for (const [key, image] of Object.entries(servicoImages)) {
      if (servico.nome.toLowerCase().includes(key.toLowerCase())) {
        return image;
      }
    }

    // Imagem padrão
    return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  }
}
