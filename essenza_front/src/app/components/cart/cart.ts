import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, CartItem, Cart } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  imports: [CommonModule],
  standalone: true
})
export class CartComponent implements OnInit {
  cart$: Observable<Cart>;
  isAuthenticated = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    if (this.isAuthenticated) {
      // Carregar carrinho apenas se estiver autenticado
      this.cartService.loadCartIfAuthenticated();
    }
  }

  // Atualizar quantidade de um item
  updateQuantity(itemId: number, event: any): void {
    const quantidade = parseInt(event.target.value);
    this.cartService.updateQuantity(itemId, quantidade).subscribe({
      next: () => {
        console.log('Quantidade atualizada com sucesso');
      },
      error: (error) => {
        console.error('Erro ao atualizar quantidade:', error);
        alert('Erro ao atualizar quantidade. Tente novamente.');
      }
    });
  }

  // Remover item do carrinho
  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        console.log('Item removido com sucesso');
      },
      error: (error) => {
        console.error('Erro ao remover item:', error);
        alert('Erro ao remover item. Tente novamente.');
      }
    });
  }

  // Limpar carrinho
  clearCart(): void {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      this.cartService.clearCart().subscribe({
        next: () => {
          console.log('Carrinho limpo com sucesso');
        },
        error: (error) => {
          console.error('Erro ao limpar carrinho:', error);
          alert('Erro ao limpar carrinho. Tente novamente.');
        }
      });
    }
  }

  // Continuar comprando
  continueShopping(): void {
    this.router.navigate(['/']);
  }

  // Finalizar compra
  checkout(): void {
    if (!this.isAuthenticated) {
      // Redirecionar para login se não estiver autenticado
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/pagamento' } 
      });
      return;
    }

    // Redirecionar para página de pagamento
    this.router.navigate(['/pagamento']);
  }

  // Formatar preço
  formatPrice(price: number | string): string {
    return this.cartService.formatPrice(price);
  }

  // Verificar se carrinho está vazio
  isEmpty(): boolean {
    return this.cartService.isEmpty();
  }

  // Obter total de itens
  getTotalItems(): number {
    return this.cartService.getCurrentCart().totalItems;
  }

  // Obter total do carrinho
  getTotal(): number {
    return this.cartService.getCurrentCart().total;
  }

  // TrackBy function para performance
  trackByServicoId(index: number, item: CartItem): number {
    return item.servico.id;
  }
}
