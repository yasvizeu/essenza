import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class ConfiguracoesComponent implements OnInit {
  currentUser: any = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  
  // Formulários
  emailForm: FormGroup;
  senhaForm: FormGroup;
  celularForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
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
  }

  ngOnInit(): void {
    // Verificar se o usuário está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    
    // Preencher formulários com dados atuais
    this.emailForm.patchValue({ email: this.currentUser?.email || '' });
    this.celularForm.patchValue({ celular: this.currentUser?.cell || '' });
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
}
