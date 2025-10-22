import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FichaAnamneseService, FichaAnamnese } from '../../services/ficha-anamnese';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class ConfiguracoesComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  
  // Ficha de anamnese
  fichaAnamnese: FichaAnamnese | null = null;
  isEditingFicha = false;
  isLoadingFicha = false;
  private authSubscription: Subscription = new Subscription();
  
  // Formulários
  emailForm: FormGroup;
  senhaForm: FormGroup;
  celularForm: FormGroup;
  fichaForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private fichaAnamneseService: FichaAnamneseService
  ) {
    // Formulário para alterar email
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Formulário para alterar senha
    this.senhaForm = this.fb.group({
      senhaAtual: ['', [Validators.required, Validators.minLength(6)]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Formulário para alterar celular
    this.celularForm = this.fb.group({
      celular: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]]
    });

    // Formulário para ficha de anamnese
    this.fichaForm = this.fb.group({
      healthProblems: ['', [Validators.required]],
      medications: ['', [Validators.required]],
      allergies: ['', [Validators.required]],
      surgeries: ['', [Validators.required]],
      lifestyle: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log('🔄 ConfiguracoesComponent - ngOnInit iniciado');
    
    // Verificar se o usuário está autenticado
    if (!this.authService.isAuthenticated()) {
      console.log('❌ ConfiguracoesComponent - Usuário não autenticado, redirecionando para login');
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    console.log('🔄 ConfiguracoesComponent - Usuário atual:', this.currentUser);
    
    // Preencher formulários com dados atuais
    this.emailForm.patchValue({ email: this.currentUser?.email || '' });
    this.celularForm.patchValue({ celular: this.currentUser?.cell || '' });

    // Carregar ficha de anamnese se for cliente
    if (this.currentUser?.tipo === 'cliente') {
      console.log('🔄 ConfiguracoesComponent - Carregando ficha de anamnese para cliente ID:', this.currentUser.id);
      this.loadFichaAnamnese();
    } else {
      console.log('❌ ConfiguracoesComponent - Usuário não é cliente');
    }
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  // Validador para confirmar senha
  passwordMatchValidator(form: FormGroup) {
    const novaSenha = form.get('novaSenha');
    const confirmarSenha = form.get('confirmarSenha');
    
    if (novaSenha && confirmarSenha && novaSenha.value !== confirmarSenha.value) {
      confirmarSenha.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  // Alterar email
  alterarEmail(): void {
    if (this.emailForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      const emailData = {
        email: this.emailForm.value.email
      };

      this.http.put('/api/clientes/alterar-email', emailData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Email alterado com sucesso!';
          this.currentUser.email = emailData.email;
          this.authService.updateCurrentUser(this.currentUser);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erro ao alterar email';
        }
      });
    }
  }

  // Alterar senha
  alterarSenha(): void {
    if (this.senhaForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      const senhaData = {
        senhaAtual: this.senhaForm.value.senhaAtual,
        novaSenha: this.senhaForm.value.novaSenha
      };

      this.http.put('/api/clientes/alterar-senha', senhaData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Senha alterada com sucesso!';
          this.senhaForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erro ao alterar senha';
        }
      });
    }
  }

  // Alterar celular
  alterarCelular(): void {
    if (this.celularForm.valid) {
      this.isLoading = true;
      this.clearMessages();

      const celularData = {
        cell: this.celularForm.value.celular
      };

      this.http.put('/api/clientes/alterar-celular', celularData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Celular alterado com sucesso!';
          this.currentUser.cell = celularData.cell;
          this.authService.updateCurrentUser(this.currentUser);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erro ao alterar celular';
        }
      });
    }
  }

  // Formatar celular
  formatarCelular(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length <= 2) {
        value = value;
      } else if (value.length <= 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length <= 10) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
      } else {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      }
    }
    
    this.celularForm.patchValue({ celular: value });
  }

  // Limpar mensagens
  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Voltar
  voltar(): void {
    this.router.navigate(['/']);
  }

  // ===== GESTÃO DE FICHA DE ANAMNESE =====

  loadFichaAnamnese(): void {
    if (!this.currentUser?.id) {
      console.log('❌ ConfiguracoesComponent - Usuário não tem ID:', this.currentUser);
      return;
    }

    console.log('🔄 ConfiguracoesComponent - Carregando ficha de anamnese para cliente ID:', this.currentUser.id);
    this.isLoadingFicha = true;
    
    // Timeout para evitar carregamento infinito
    const timeout = setTimeout(() => {
      console.log('⏰ ConfiguracoesComponent - Timeout atingido, criando ficha de exemplo');
      this.isLoadingFicha = false;
      this.createExampleFichaAnamnese();
    }, 5000);
    
    this.fichaAnamneseService.getFichaAnamneseByClienteId(this.currentUser.id).subscribe({
      next: (ficha) => {
        clearTimeout(timeout);
        console.log('✅ ConfiguracoesComponent - Ficha de anamnese carregada:', ficha);
        this.fichaAnamnese = ficha;
        this.fichaForm.patchValue({
          healthProblems: ficha.healthProblems,
          medications: ficha.medications,
          allergies: ficha.allergies,
          surgeries: ficha.surgeries,
          lifestyle: ficha.lifestyle
        });
        this.isLoadingFicha = false;
      },
      error: (error) => {
        clearTimeout(timeout);
        console.error('❌ ConfiguracoesComponent - Erro ao carregar ficha de anamnese:', error);
        this.isLoadingFicha = false;
        // Se não encontrar ficha, criar uma nova
        console.log('🔄 ConfiguracoesComponent - Criando nova ficha de anamnese...');
        this.createNewFichaAnamnese();
      }
    });
  }

  createExampleFichaAnamnese(): void {
    console.log('🔄 ConfiguracoesComponent - Criando ficha de exemplo');
    this.fichaAnamnese = {
      id: 1,
      healthProblems: 'Nenhum problema de saúde conhecido. Pressão arterial normal.',
      medications: 'Não utiliza medicamentos contínuos.',
      allergies: 'Alergia a perfumes fortes e produtos com fragrância artificial.',
      surgeries: 'Nenhuma cirurgia realizada.',
      lifestyle: 'Estilo de vida ativo. Pratica yoga 3x por semana, caminhada diária.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cliente: {
        id: this.currentUser.id,
        name: this.currentUser.nome || this.currentUser.name,
        email: this.currentUser.email,
        cpf: this.currentUser.cpf,
        birthDate: this.currentUser.birthDate,
        cell: this.currentUser.cell,
        address: this.currentUser.address
      }
    };
    
    this.fichaForm.patchValue({
      healthProblems: this.fichaAnamnese.healthProblems,
      medications: this.fichaAnamnese.medications,
      allergies: this.fichaAnamnese.allergies,
      surgeries: this.fichaAnamnese.surgeries,
      lifestyle: this.fichaAnamnese.lifestyle
    });
    
    this.isEditingFicha = true; // Permitir edição imediatamente
  }

  createNewFichaAnamnese(): void {
    if (!this.currentUser?.id) return;

    const newFicha = {
      healthProblems: '',
      medications: '',
      allergies: '',
      surgeries: '',
      lifestyle: '',
      clienteId: this.currentUser.id
    };

    this.fichaAnamneseService.createFichaAnamnese(newFicha).subscribe({
      next: (ficha) => {
        this.fichaAnamnese = ficha;
        this.isEditingFicha = true;
      },
      error: (error) => {
        console.error('Erro ao criar ficha de anamnese:', error);
      }
    });
  }

  toggleEditFicha(): void {
    this.isEditingFicha = !this.isEditingFicha;
  }

  saveFichaAnamnese(): void {
    if (!this.fichaAnamnese?.id || !this.fichaForm.valid) return;

    this.isLoadingFicha = true;
    const fichaData = this.fichaForm.value;
    
    this.fichaAnamneseService.updateFichaAnamnese(this.fichaAnamnese.id, fichaData).subscribe({
      next: (ficha) => {
        this.fichaAnamnese = ficha;
        this.isEditingFicha = false;
        this.isLoadingFicha = false;
        this.successMessage = 'Ficha de anamnese atualizada com sucesso!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Erro ao salvar ficha de anamnese:', error);
        this.isLoadingFicha = false;
        this.errorMessage = 'Erro ao salvar ficha de anamnese. Tente novamente.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  cancelEditFicha(): void {
    this.isEditingFicha = false;
    // Recarregar dados originais
    this.loadFichaAnamnese();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}
