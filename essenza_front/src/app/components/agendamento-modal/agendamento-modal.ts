import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicosService, Servico } from '../../services/servicos';
import { CartService } from '../../services/cart';


@Component({
  selector: 'app-agendamento-modal',
  templateUrl: './agendamento-modal.html',
  styleUrl: './agendamento-modal.scss',
  imports: [CommonModule],
  standalone: true
})
export class AgendamentoModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() servico: Servico | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() servicoAdicionado = new EventEmitter<any>();

  // Estados
  hasError = false;
  errorMessage = '';

  constructor(
    private servicosService: ServicosService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🔍 Modal inicializado:', { servico: this.servico, isOpen: this.isOpen });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('🔍 Mudanças detectadas:', changes);
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }


  closeModal(): void {
    this.hasError = false;
    this.errorMessage = '';
    this.close.emit();
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
  formatarPreco(preco: number): string {
    return this.servicosService.formatPrice(preco);
  }

  formatarDuracao(minutes: number): string {
    return this.servicosService.formatDuration(minutes);
  }

  // Getters
  get servicoNome(): string {
    return this.servico?.nome || '';
  }

  get servicoPreco(): number {
    if (!this.servico?.preco) return 0;
    const numericPrice = typeof this.servico.preco === 'string' ? parseFloat(this.servico.preco) : this.servico.preco;
    return isNaN(numericPrice) ? 0 : numericPrice;
  }

  get servicoDuracao(): number {
    return this.servico?.duracao || 60;
  }

  get servicoDescricao(): string {
    return this.servico?.descricao || '';
  }

  // ===== MÉTODOS DO CARRINHO =====

  // Adicionar ao carrinho
  adicionarAoCarrinho(): void {
    if (!this.servico) return;

    this.cartService.addToCart(this.servico, 1).subscribe({
      next: () => {
        this.showSuccess('Serviço adicionado ao carrinho!');
        this.servicoAdicionado.emit(this.servico);
      },
      error: (error) => {
        console.error('Erro ao adicionar ao carrinho:', error);
        this.showError('Erro ao adicionar ao carrinho. Tente novamente.');
      }
    });
  }

  // Verificar se está no carrinho
  isInCart(): boolean {
    return this.servico ? this.cartService.isInCart(this.servico.id) : false;
  }

  // Obter quantidade no carrinho
  getQuantityInCart(): number {
    return this.servico ? this.cartService.getItemQuantity(this.servico.id) : 0;
  }

  // Ir para o carrinho
  irParaCarrinho(): void {
    this.closeModal();
    this.router.navigate(['/carrinho']);
  }
}
