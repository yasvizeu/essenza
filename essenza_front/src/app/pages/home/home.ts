import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicosService, Servico } from '../../services/servicos';
import { CartService, CartItem } from '../../services/cart';

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

  constructor(
    private servicosService: ServicosService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadServicos();
    this.cartSubscription = this.cartService.getCartObservable().subscribe(cart => {
      this.cart = cart;
    });
    
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
    this.servicosService.getServicos().subscribe({
      next: (servicos) => {
        this.servicos = servicos;
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
      
      // Mostrar mensagem de sucesso
      this.showSuccessMessage();
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
