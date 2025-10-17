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
        const headers = { 'Authorization': `Bearer ${token}` };
        return this.http.post(`${this.apiUrl}/carrinho/adicionar`, {
          servicoId: servico.id,
          quantidade: quantidade
        }, { headers }).pipe(
          tap(() => {
            // Recarregar carrinho após adicionar
            this.loadCartFromAPI().subscribe();
          }),
          catchError(error => {
            console.error('Erro ao adicionar via API:', error);
            // Fallback para adição local
            this.addItemLocally(servico, quantidade);
            return new Observable(observer => {
              observer.next({ success: true });
              observer.complete();
            });
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
    console.log('🔍 Debug - addItemLocally chamado para:', servico.nome, 'quantidade:', quantidade);
    
    const currentCart = this.cartSubject.value;
    console.log('🔍 Debug - Carrinho atual antes:', currentCart);
    
    const existingItem = currentCart.items.find(item => item.servico.id === servico.id);

    if (existingItem) {
      // Atualizar quantidade se item já existe
      console.log('🔍 Debug - Item já existe, atualizando quantidade');
      existingItem.quantidade += quantidade;
      existingItem.precoTotal = this.parsePrice(existingItem.precoUnitario) * existingItem.quantidade;
    } else {
      // Adicionar novo item
      console.log('🔍 Debug - Adicionando novo item');
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
    console.log('🔍 Debug - Carrinho após adição:', currentCart);
    this.cartSubject.next(currentCart);
    this.saveCartToStorage();
    console.log('🔍 Debug - Item adicionado localmente com sucesso');
  }

  // Remover item do carrinho
  removeFromCart(itemId: number): Observable<any> {
    console.log('🔍 Debug - removeFromCart chamado para item:', itemId);
    
    // Verificar se está autenticado
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('essenza_access_token');
      console.log('🔍 Debug - Token encontrado:', !!token);
      console.log('🔍 Debug - Token value:', token);
      
      if (token) {
        // Usuário logado - usar API com token
        console.log('🔍 Debug - Removendo via API para item:', itemId);
        console.log('🔍 Debug - URL:', `${this.apiUrl}/carrinho/${itemId}`);
        const headers = { 'Authorization': `Bearer ${token}` };
        return this.http.delete(`${this.apiUrl}/carrinho/${itemId}`, { headers }).pipe(
          tap(() => {
            console.log('🔍 Debug - Item removido via API, recarregando carrinho');
            this.loadCartFromAPI();
          }),
          catchError(error => {
            console.error('🔍 Debug - Erro na API, removendo localmente:', error);
            this.removeItemLocally(itemId);
            return new Observable(observer => {
              observer.next({ success: true });
              observer.complete();
            });
          })
        );
      }
    }

    // Usuário não logado - remover localmente
    console.log('🔍 Debug - Removendo localmente');
    return new Observable(observer => {
      this.removeItemLocally(itemId);
      console.log('🔍 Debug - Item removido localmente com sucesso');
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
    console.log('🔍 Debug - updateQuantity chamado para item:', itemId, 'quantidade:', quantidade);
    
    if (quantidade <= 0) {
      return this.removeFromCart(itemId);
    }

    // Verificar se está autenticado
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('essenza_access_token');
      console.log('🔍 Debug - Token encontrado:', !!token);
      
      if (token) {
        // Usuário logado - usar API
        console.log('🔍 Debug - Atualizando via API');
        const headers = { 'Authorization': `Bearer ${token}` };
        return this.http.put(`${this.apiUrl}/carrinho/${itemId}`, {
          quantidade: quantidade
        }, { headers }).pipe(
          tap(() => {
            console.log('🔍 Debug - Quantidade atualizada via API, recarregando carrinho');
            // Recarregar carrinho após atualizar
            this.loadCartFromAPI().subscribe({
              next: (cart) => {
                console.log('🔍 Debug - Carrinho recarregado após atualização:', cart);
              },
              error: (error) => {
                console.error('🔍 Debug - Erro ao recarregar carrinho:', error);
              }
            });
          }),
          catchError(error => {
            console.error('🔍 Debug - Erro ao atualizar via API:', error);
            // Fallback para atualização local
            this.updateQuantityLocally(itemId, quantidade);
            return new Observable(observer => {
              observer.next({ success: true });
              observer.complete();
            });
          })
        );
      }
    }

    // Usuário não logado - atualizar localmente
    console.log('🔍 Debug - Atualizando localmente');
    return new Observable(observer => {
      this.updateQuantityLocally(itemId, quantidade);
      observer.next({ success: true });
      observer.complete();
    });
  }

  // Atualizar quantidade localmente (para usuários não logados)
  private updateQuantityLocally(itemId: number, quantidade: number): void {
    console.log('🔍 Debug - updateQuantityLocally chamado para item:', itemId, 'quantidade:', quantidade);
    
    const currentCart = this.cartSubject.value;
    console.log('🔍 Debug - Carrinho atual antes da atualização:', currentCart);
    
    const item = currentCart.items.find(item => item.id === itemId);
    
    if (item) {
      console.log('🔍 Debug - Item encontrado, atualizando quantidade');
      item.quantidade = quantidade;
      item.precoTotal = this.parsePrice(item.precoUnitario) * quantidade;
      this.updateCartTotals(currentCart);
      console.log('🔍 Debug - Carrinho após atualização:', currentCart);
      this.cartSubject.next(currentCart);
      this.saveCartToStorage();
      console.log('🔍 Debug - Quantidade atualizada localmente com sucesso');
    } else {
      console.log('🔍 Debug - Item não encontrado no carrinho');
    }
  }

  // Limpar carrinho localmente
  clearCartLocal(): void {
    console.log('🔍 Debug - Limpando carrinho localmente');
    this.cartSubject.next({
      items: [],
      total: 0,
      totalItems: 0
    });
    this.saveCartToStorage();
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
            console.log('🔍 Debug - Limpando carrinho via API');
            this.cartSubject.next({
              items: [],
              total: 0,
              totalItems: 0
            });
            this.saveCartToStorage();
          }),
          catchError((error) => {
            console.error('Erro ao limpar carrinho via API:', error);
            // Se falhar, limpar localmente mesmo assim
            this.cartSubject.next({
              items: [],
              total: 0,
              totalItems: 0
            });
            this.saveCartToStorage();
            return [];
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
  loadCartFromAPI(): Observable<any> {
    const token = localStorage.getItem('essenza_access_token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;
    
    return this.http.get<any>(`${this.apiUrl}/carrinho`, { headers }).pipe(
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