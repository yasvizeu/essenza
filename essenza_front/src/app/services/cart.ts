import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  tipo: 'servico' | 'produto';
  imagem?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    total: 0,
    itemCount: 0
  });

  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  // Adicionar item ao carrinho
  addItem(item: Omit<CartItem, 'quantidade'>, quantidade: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(
      cartItem => cartItem.id === item.id && cartItem.tipo === item.tipo
    );

    if (existingItemIndex >= 0) {
      // Item já existe, aumentar quantidade
      currentCart.items[existingItemIndex].quantidade += quantidade;
    } else {
      // Novo item
      currentCart.items.push({ ...item, quantidade });
    }

    this.updateCart(currentCart);
  }

  // Remover item do carrinho
  removeItem(itemId: number, tipo: 'servico' | 'produto'): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(
      item => !(item.id === itemId && item.tipo === tipo)
    );
    this.updateCart(currentCart);
  }

  // Atualizar quantidade de um item
  updateQuantity(itemId: number, tipo: 'servico' | 'produto', quantidade: number): void {
    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.items.findIndex(
      item => item.id === itemId && item.tipo === tipo
    );

    if (itemIndex >= 0) {
      if (quantidade <= 0) {
        currentCart.items.splice(itemIndex, 1);
      } else {
        currentCart.items[itemIndex].quantidade = quantidade;
      }
      this.updateCart(currentCart);
    }
  }

  // Limpar carrinho
  clearCart(): void {
    this.updateCart({ items: [], total: 0, itemCount: 0 });
  }

  // Obter carrinho atual
  getCart(): Cart {
    return this.cartSubject.value;
  }

  // Obter observável do carrinho
  getCartObservable(): Observable<Cart> {
    return this.cart$;
  }

  // Calcular total e quantidade de itens
  private updateCart(cart: Cart): void {
    cart.total = cart.items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantidade, 0);
    
    this.cartSubject.next(cart);
    this.saveCartToStorage(cart);
  }

  // Salvar carrinho no localStorage
  private saveCartToStorage(cart: Cart): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('essenza_cart', JSON.stringify(cart));
    }
  }

  // Carregar carrinho do localStorage
  private loadCartFromStorage(): void {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('essenza_cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          this.cartSubject.next(cart);
        } catch (error) {
          console.error('Erro ao carregar carrinho do localStorage:', error);
        }
      }
    }
  }

  // Formatar preço
  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }
}
