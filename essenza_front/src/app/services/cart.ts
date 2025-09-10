import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Servico } from './dashboard';

export interface CartItem {
  id: number;
  servico: Servico;
  quantidade: number;
  precoUnitario: number | string;
  precoTotal: number | string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  totalItems: number;
}

export interface PaymentData {
  metodoPagamento: 'pix' | 'cartao';
  dadosCartao?: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  };
  dadosPix?: {
    chave: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000';
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    total: 0,
    totalItems: 0
  });

  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
    // Não carregar carrinho automaticamente - será carregado quando necessário
  }

  // Adicionar item ao carrinho
  addToCart(servico: Servico, quantidade: number = 1): Observable<any> {
    // Verificar se está autenticado
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('essenza_access_token');
      if (token) {
        // Usuário logado - usar API
        return this.http.post(`${this.apiUrl}/carrinho/adicionar`, {
          servicoId: servico.id,
          quantidade: quantidade
        }).pipe(
          tap(() => {
            // Recarregar carrinho após adicionar
            this.loadCartFromAPI();
          })
        );
      }
    }

    // Usuário não logado - adicionar localmente
    return new Observable(observer => {
      this.addItemLocally(servico, quantidade);
      observer.next({ success: true });
      observer.complete();
    });
  }

  // Adicionar item localmente (para usuários não logados)
  private addItemLocally(servico: Servico, quantidade: number): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.items.find(item => item.servico.id === servico.id);

    if (existingItem) {
      // Atualizar quantidade se item já existe
      existingItem.quantidade += quantidade;
      existingItem.precoTotal = this.parsePrice(existingItem.precoUnitario) * existingItem.quantidade;
    } else {
      // Adicionar novo item
      const precoUnitario = this.parsePrice(servico.preco);
      const newItem: CartItem = {
        id: Date.now(), // ID temporário
        servico: servico,
        quantidade: quantidade,
        precoUnitario: precoUnitario,
        precoTotal: precoUnitario * quantidade
      };
      currentCart.items.push(newItem);
    }

    this.updateCartTotals(currentCart);
    this.saveCartToStorage();
  }

  // Remover item do carrinho
  removeFromCart(itemId: number): Observable<any> {
    // Verificar se está autenticado
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('essenza_access_token');
      if (token) {
        // Usuário logado - usar API
        return this.http.delete(`${this.apiUrl}/carrinho/${itemId}`).pipe(
          tap(() => {
            this.loadCartFromAPI();
          })
        );
      }
    }

    // Usuário não logado - remover localmente
    return new Observable(observer => {
      this.removeItemLocally(itemId);
      observer.next({ success: true });
      observer.complete();
    });
  }

  // Remover item localmente (para usuários não logados)
  private removeItemLocally(itemId: number): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(item => item.id !== itemId);
    this.updateCartTotals(currentCart);
    this.saveCartToStorage();
  }

  // Atualizar quantidade de um item
  updateQuantity(itemId: number, quantidade: number): Observable<any> {
    if (quantidade <= 0) {
      return this.removeFromCart(itemId);
    }

    // Verificar se está autenticado
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('essenza_access_token');
      if (token) {
        // Usuário logado - usar API
        return this.http.put(`${this.apiUrl}/carrinho/${itemId}`, {
          quantidade: quantidade
        }).pipe(
          tap(() => {
            this.loadCartFromAPI();
          })
        );
      }
    }

    // Usuário não logado - atualizar localmente
    return new Observable(observer => {
      this.updateQuantityLocally(itemId, quantidade);
      observer.next({ success: true });
      observer.complete();
    });
  }

  // Atualizar quantidade localmente (para usuários não logados)
  private updateQuantityLocally(itemId: number, quantidade: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find(item => item.id === itemId);
    
    if (item) {
      item.quantidade = quantidade;
      item.precoTotal = this.parsePrice(item.precoUnitario) * quantidade;
      this.updateCartTotals(currentCart);
      this.saveCartToStorage();
    }
  }

  // Limpar carrinho
  clearCart(): Observable<any> {
    // Verificar se está autenticado
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('essenza_access_token');
      if (token) {
        // Usuário logado - usar API
        return this.http.delete(`${this.apiUrl}/carrinho`).pipe(
          tap(() => {
            this.cartSubject.next({
              items: [],
              total: 0,
              totalItems: 0
            });
            this.saveCartToStorage();
          })
        );
      }
    }

    // Usuário não logado - limpar localmente
    return new Observable(observer => {
      this.cartSubject.next({
        items: [],
        total: 0,
        totalItems: 0
      });
      this.saveCartToStorage();
      observer.next({ success: true });
      observer.complete();
    });
  }

  // Carregar carrinho da API (apenas quando autenticado)
  loadCartFromAPI(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/carrinho`).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.saveCartToStorage();
      }),
      catchError(error => {
        console.error('Erro ao carregar carrinho:', error);
        // Se não estiver autenticado, manter carrinho vazio
        this.cartSubject.next({
          items: [],
          total: 0,
          totalItems: 0
        });
        return [];
      })
    );
  }

  // Carregar carrinho se autenticado
  loadCartIfAuthenticated(): void {
    // Verificar se há token de autenticação
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('essenza_access_token');
      if (token) {
        this.loadCartFromAPI().subscribe();
      } else {
        // Se não estiver autenticado, carregar carrinho local
        this.loadCartFromStorage();
      }
    }
  }

  // Obter carrinho atual
  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }

  // Verificar se o carrinho está vazio
  isEmpty(): boolean {
    return this.cartSubject.value.items.length === 0;
  }

  // Obter quantidade de um item específico
  getItemQuantity(servicoId: number): number {
    const item = this.cartSubject.value.items.find(item => item.servico.id === servicoId);
    return item ? item.quantidade : 0;
  }

  // Verificar se um serviço está no carrinho
  isInCart(servicoId: number): boolean {
    return this.cartSubject.value.items.some(item => item.servico.id === servicoId);
  }

  // Verificar item no carrinho via API
  checkItemInCart(servicoId: number): Observable<{isInCart: boolean, quantidade: number}> {
    return this.http.get<{isInCart: boolean, quantidade: number}>(`${this.apiUrl}/carrinho/verificar/${servicoId}`);
  }

  // Atualizar totais do carrinho
  private updateCartTotals(cart: Cart): void {
    cart.total = cart.items.reduce((sum, item) => sum + this.parsePrice(item.precoTotal), 0);
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantidade, 0);
    this.cartSubject.next(cart);
  }

  // Salvar carrinho no localStorage
  private saveCartToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('essenza_cart', JSON.stringify(this.cartSubject.value));
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

  // Converter preço para número
  private parsePrice(price: number | string): number {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numericPrice) ? 0 : numericPrice;
  }

  // Formatar preço
  formatPrice(price: number | string): string {
    const numericPrice = this.parsePrice(price);
    return `R$ ${numericPrice.toFixed(2).replace('.', ',')}`;
  }

  // Calcular desconto (para futuras implementações)
  calculateDiscount(percentage: number): number {
    return (this.cartSubject.value.total * percentage) / 100;
  }

  // Aplicar cupom de desconto (para futuras implementações)
  applyCoupon(couponCode: string): { valid: boolean; discount: number; message: string } {
    // Mock para MVP - implementar lógica real no futuro
    const validCoupons: { [key: string]: number } = {
      'DESCONTO10': 10,
      'BEMVINDO': 15,
      'FIDELIDADE': 20
    };

    if (validCoupons[couponCode]) {
      const discount = this.calculateDiscount(validCoupons[couponCode]);
      return {
        valid: true,
        discount,
        message: `Cupom aplicado! Desconto de ${validCoupons[couponCode]}%`
      };
    }

    return {
      valid: false,
      discount: 0,
      message: 'Cupom inválido'
    };
  }
}