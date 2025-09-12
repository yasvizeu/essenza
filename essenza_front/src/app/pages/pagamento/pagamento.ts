import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, PaymentData, Cart } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { AgendamentosService } from '../../services/agendamentos';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.html',
  styleUrl: './pagamento.scss',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class PagamentoComponent implements OnInit {
  paymentForm!: FormGroup;
  cart$: Observable<Cart>;
  isAuthenticated = false;
  isLoading = false;
  selectedPaymentMethod: 'pix' | 'cartao' = 'pix';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private agendamentosService: AgendamentosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.cart$ = this.cartService.cart$;
    this.initForm();
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/pagamento' } 
      });
      return;
    }

    // Carregar carrinho se autenticado
    this.cartService.loadCartIfAuthenticated();

    if (this.cartService.isEmpty()) {
      this.router.navigate(['/carrinho']);
      return;
    }
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      metodoPagamento: ['pix', Validators.required],
      // Dados do cartão
      numeroCartao: [''],
      nomeCartao: [''],
      validadeCartao: [''],
      cvvCartao: [''],
      // Dados do PIX
      chavePix: [''],
      // Dados de contato
      email: [this.authService.getCurrentUser()?.email || '', [Validators.required, Validators.email]],
      telefone: [this.authService.getCurrentUser()?.cell || '', Validators.required]
    });

    // Atualizar validações baseado no método de pagamento
    this.paymentForm.get('metodoPagamento')?.valueChanges.subscribe(method => {
      this.selectedPaymentMethod = method;
      this.updateValidators();
    });
  }

  updateValidators(): void {
    const numeroCartao = this.paymentForm.get('numeroCartao');
    const nomeCartao = this.paymentForm.get('nomeCartao');
    const validadeCartao = this.paymentForm.get('validadeCartao');
    const cvvCartao = this.paymentForm.get('cvvCartao');
    const chavePix = this.paymentForm.get('chavePix');

    if (this.selectedPaymentMethod === 'cartao') {
      numeroCartao?.setValidators([Validators.required, this.cardNumberValidator]);
      nomeCartao?.setValidators([Validators.required, this.nameValidator]);
      validadeCartao?.setValidators([Validators.required, this.expiryValidator]);
      cvvCartao?.setValidators([Validators.required, this.cvvValidator]);
      chavePix?.clearValidators();
    } else {
      chavePix?.setValidators([Validators.required, this.pixKeyValidator]);
      numeroCartao?.clearValidators();
      nomeCartao?.clearValidators();
      validadeCartao?.clearValidators();
      cvvCartao?.clearValidators();
    }

    // Atualizar validação
    numeroCartao?.updateValueAndValidity();
    nomeCartao?.updateValueAndValidity();
    validadeCartao?.updateValueAndValidity();
    cvvCartao?.updateValueAndValidity();
    chavePix?.updateValueAndValidity();
  }

  // Validador de número do cartão
  cardNumberValidator(control: any) {
    const value = control.value?.replace(/\D/g, '');
    if (!value) return null;
    
    // Algoritmo de Luhn
    let sum = 0;
    let isEven = false;
    
    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0 ? null : { invalidCard: true };
  }

  // Validador de nome no cartão
  nameValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    return nameRegex.test(value) ? null : { invalidName: true };
  }

  // Validador de validade do cartão
  expiryValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(value)) return { invalidExpiry: true };
    
    const [month, year] = value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return { expiredCard: true };
    }
    
    return null;
  }

  // Validador de CVV
  cvvValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    
    const cvvRegex = /^\d{3,4}$/;
    return cvvRegex.test(value) ? null : { invalidCvv: true };
  }

  // Validador de chave PIX
  pixKeyValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    
    // Validação básica de chave PIX
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const randomKeyRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    
    if (emailRegex.test(value) || phoneRegex.test(value) || 
        cpfRegex.test(value) || randomKeyRegex.test(value)) {
      return null;
    }
    
    return { invalidPixKey: true };
  }

  // Formatar número do cartão
  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    event.target.value = value;
  }

  // Formatar validade do cartão
  formatExpiry(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
  }

  // Formatar CVV
  formatCvv(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    event.target.value = value.substring(0, 4);
  }

  // Formatar chave PIX
  formatPixKey(event: any): void {
    let value = event.target.value;
    // Se for CPF, formatar
    if (/^\d{11}$/.test(value.replace(/\D/g, ''))) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    // Se for telefone, formatar
    else if (/^\d{11}$/.test(value.replace(/\D/g, ''))) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    event.target.value = value;
  }

  // Processar pagamento
  processPayment(): void {
    if (this.paymentForm.valid) {
      this.isLoading = true;
      
      // Simular processamento de pagamento (MVP)
      setTimeout(() => {
        this.completePayment();
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  // Completar pagamento
  private completePayment(): void {
    const cart = this.cartService.getCurrentCart();
    const paymentData: PaymentData = {
      metodoPagamento: this.selectedPaymentMethod,
      dadosCartao: this.selectedPaymentMethod === 'cartao' ? {
        numero: this.paymentForm.value.numeroCartao,
        nome: this.paymentForm.value.nomeCartao,
        validade: this.paymentForm.value.validadeCartao,
        cvv: this.paymentForm.value.cvvCartao
      } : undefined,
      dadosPix: this.selectedPaymentMethod === 'pix' ? {
        chave: this.paymentForm.value.chavePix
      } : undefined
    };

    // Criar agendamentos para cada item do carrinho
    this.createAppointments(cart, paymentData);
  }

  // Marcar serviços como pagos (sem criar agendamentos)
  private createAppointments(cart: any, paymentData: PaymentData): void {
    const currentUser = this.authService.getCurrentUser();
    
    console.log('🔍 Debug - Marcando serviços como pagos via API');
    console.log('🔍 Debug - Carrinho:', cart);
    console.log('🔍 Debug - Usuário:', currentUser);
    
    // Criar agendamentos tentative via API (sem data/hora definida)
    const appointments = cart.items.map((item: any) => ({
      title: item.servico.nome,
      description: item.servico.descricao,
      startDateTime: new Date().toISOString(), // Data temporária para validação do DTO
      endDateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hora depois
      clienteId: currentUser.id,
      profissionalId: 1, // Profissional padrão
      servicoId: item.servico.id,
      valor: item.precoTotal,
      status: 'tentative', // Status tentative para aparecer em "Pagos Não Agendados"
      statusPagamento: 'pago' // APENAS este campo é mockado
    }));

    console.log('🔍 Debug - Criando agendamentos tentative via API:', appointments);
    
    // Salvar cada agendamento no backend
    let completedAppointments = 0;
    const totalAppointments = appointments.length;
    
    appointments.forEach((appointment: any, index: number) => {
      this.agendamentosService.criarAgendamento(appointment).subscribe({
        next: (createdAppointment: any) => {
          console.log(`🔍 Debug - Agendamento tentative ${index + 1} criado via API:`, createdAppointment);
          completedAppointments++;
          
          if (completedAppointments === totalAppointments) {
            this.finalizePayment();
          }
        },
        error: (error) => {
          console.error(`🔍 Debug - Erro ao criar agendamento ${index + 1}:`, error);
          completedAppointments++;
          
          if (completedAppointments === totalAppointments) {
            this.finalizePayment();
          }
        }
      });
    });
  }

  // Finalizar pagamento
  private finalizePayment(): void {
    // Limpar carrinho
    this.cartService.clearCart().subscribe({
      next: () => {
        console.log('🔍 Debug - Carrinho limpo após pagamento');
        this.isLoading = false;
        
        // Redirecionar para página de agendamentos do cliente
        this.router.navigate(['/cliente-agendamentos'], {
          queryParams: { payment: 'success' }
        });
      },
      error: (error) => {
        console.error('🔍 Debug - Erro ao limpar carrinho:', error);
        this.cartService.clearCartLocal();
        this.isLoading = false;
        
        // Redirecionar mesmo com erro
        this.router.navigate(['/cliente-agendamentos'], {
          queryParams: { payment: 'success' }
        });
      }
    });
  }

  // Marcar todos os campos como tocados para mostrar erros
  private markFormGroupTouched(): void {
    Object.keys(this.paymentForm.controls).forEach(key => {
      const control = this.paymentForm.get(key);
      control?.markAsTouched();
    });
  }

  // Obter total do carrinho
  getTotal(): number {
    return this.cartService.getCurrentCart().total;
  }

  // Formatar preço
  formatPrice(price: number | string): string {
    return this.cartService.formatPrice(price);
  }

  // Verificar se campo tem erro
  hasFieldError(fieldName: string): boolean {
    const control = this.paymentForm.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }

  // Obter mensagem de erro
  getErrorMessage(fieldName: string): string {
    const control = this.paymentForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) return 'Este campo é obrigatório';
      if (control.errors['email']) return 'Email inválido';
      if (control.errors['invalidCard']) return 'Número do cartão inválido';
      if (control.errors['invalidName']) return 'Nome inválido';
      if (control.errors['invalidExpiry']) return 'Data de validade inválida';
      if (control.errors['expiredCard']) return 'Cartão expirado';
      if (control.errors['invalidCvv']) return 'CVV inválido';
      if (control.errors['invalidPixKey']) return 'Chave PIX inválida';
    }
    return '';
  }

  // Voltar ao carrinho
  backToCart(): void {
    this.router.navigate(['/carrinho']);
  }
}
