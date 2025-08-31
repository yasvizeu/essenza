import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  userType: 'cliente' | 'profissional' = 'cliente';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]], // Mudado de 'password' para 'senha'
      rememberMe: [false]
    });
  }

  // Alternar tipo de usuário
  toggleUserType(): void {
    this.userType = this.userType === 'cliente' ? 'profissional' : 'cliente';
    this.errorMessage = ''; // Limpar mensagens de erro ao trocar tipo
  }

  // Alternar visibilidade da senha
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Submeter formulário de login
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: LoginRequest = {
        email: this.loginForm.value.email,
        senha: this.loginForm.value.senha, // Mudado de 'password' para 'senha'
        userType: this.userType
      };

      // Escolher método de login baseado no tipo de usuário
      const loginMethod = this.userType === 'cliente'
        ? this.authService.loginCliente(credentials)
        : this.authService.loginProfissional(credentials);

      loginMethod.subscribe({
        next: (response) => {
          console.log('Login realizado com sucesso:', response);
          this.isLoading = false;

          // O redirecionamento é feito automaticamente pelo AuthService
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.isLoading = false;

          // Tratar diferentes tipos de erro
          if (error.status === 401) {
            this.errorMessage = 'Email ou senha incorretos.';
          } else if (error.status === 404) {
            this.errorMessage = 'Usuário não encontrado.';
          } else if (error.status === 400) {
            this.errorMessage = 'Dados inválidos. Verifique o email e senha.';
          } else if (error.status === 0) {
            this.errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
          } else {
            this.errorMessage = 'Erro ao fazer login. Tente novamente.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // Marcar todos os campos como tocados para mostrar validações
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Obter mensagem de erro para campo específico
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);

    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return 'Este campo é obrigatório';
      } else if (control.errors['email']) {
        return 'Email inválido';
      } else if (control.errors['minlength']) {
        return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
      }
    }

    return '';
  }

  // Redirecionar para página de cadastro
  goToCadastro(): void {
    this.router.navigate(['/cadastro']);
  }

  // Verificar se o campo é válido
  isFieldValid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  // Verificar se o campo é válido
  isFieldInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  // Verificar se o campo foi tocado
  isFieldTouched(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.touched);
  }
}
